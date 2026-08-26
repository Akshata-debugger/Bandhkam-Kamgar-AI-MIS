-- Phase 6: additive worker lifecycle and import foundations.
-- This migration only creates new tables. It never drops or overwrites Phase 1–5 data.
USE bandhkam_kamgar_db;

CREATE TABLE IF NOT EXISTS worker_card_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  worker_id BIGINT UNSIGNED NOT NULL,
  card_number VARCHAR(100) NULL,
  issue_date DATE NULL,
  expiry_date DATE NULL,
  renewal_due_date DATE NULL,
  card_status ENUM('active','expiring_soon','expired','renewed','suspended') NOT NULL DEFAULT 'active',
  remarks TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_card_history_worker_status (worker_id, card_status), KEY idx_card_history_due (renewal_due_date),
  CONSTRAINT fk_card_history_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  CONSTRAINT fk_card_history_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS physical_verification_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  worker_id BIGINT UNSIGNED NOT NULL,
  verification_date DATE NULL,
  verification_status ENUM('pending','scheduled','completed','missed') NOT NULL DEFAULT 'pending',
  verified_by BIGINT UNSIGNED NULL,
  verification_remarks TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_verification_history_worker_status (worker_id, verification_status),
  CONSTRAINT fk_verification_history_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  CONSTRAINT fk_verification_history_user FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS worker_claims (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  worker_id BIGINT UNSIGNED NOT NULL,
  claim_type ENUM('marriage','medical','housing','death','accident','education') NOT NULL,
  application_date DATE NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  approval_date DATE NULL,
  amount DECIMAL(12,2) NULL,
  remarks TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_claims_worker_status (worker_id, status), KEY idx_claims_type (claim_type),
  CONSTRAINT fk_claims_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  CONSTRAINT fk_claims_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS worker_lifecycle_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  worker_id BIGINT UNSIGNED NOT NULL,
  event_type ENUM('registration','card_issued','physical_verification','renewal','scholarship','claim','import') NOT NULL,
  event_date DATE NOT NULL,
  title VARCHAR(180) NOT NULL,
  details TEXT NULL,
  source_table VARCHAR(64) NULL,
  source_id BIGINT UNSIGNED NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_lifecycle_worker_date (worker_id, event_date DESC),
  CONSTRAINT fk_lifecycle_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  CONSTRAINT fk_lifecycle_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS import_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_type ENUM('google_sheets','csv','excel') NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  imported_by BIGINT UNSIGNED NULL,
  rows_read INT UNSIGNED NOT NULL DEFAULT 0,
  workers_added INT UNSIGNED NOT NULL DEFAULT 0,
  workers_updated INT UNSIGNED NOT NULL DEFAULT 0,
  duplicates INT UNSIGNED NOT NULL DEFAULT 0,
  errors INT UNSIGNED NOT NULL DEFAULT 0,
  duration_ms INT UNSIGNED NULL,
  status ENUM('previewed','running','completed','failed') NOT NULL DEFAULT 'previewed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  PRIMARY KEY (id), KEY idx_import_history_status_date (status, created_at),
  CONSTRAINT fk_import_history_user FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS import_sync_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  import_history_id BIGINT UNSIGNED NOT NULL,
  source_row_number INT UNSIGNED NULL,
  worker_id BIGINT UNSIGNED NULL,
  decision ENUM('new_worker','update_worker','duplicate','no_change','error') NOT NULL,
  message VARCHAR(500) NULL,
  payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_sync_logs_import_action (import_history_id, decision),
  CONSTRAINT fk_sync_logs_history FOREIGN KEY (import_history_id) REFERENCES import_history(id) ON DELETE CASCADE,
  CONSTRAINT fk_sync_logs_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL
) ENGINE=InnoDB;
