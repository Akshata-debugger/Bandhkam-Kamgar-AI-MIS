-- Phase 4: Ratnagiri District General Workers Union worker module.
USE bandhkam_kamgar_db;

CREATE TABLE IF NOT EXISTS schemes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_schemes_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  worker_code VARCHAR(20) NOT NULL,
  profile_photo_path VARCHAR(500) NULL,
  first_name VARCHAR(100) NOT NULL, middle_name VARCHAR(100) NULL, last_name VARCHAR(100) NOT NULL,
  gender ENUM('male','female','other','prefer_not_to_say') NULL,
  date_of_birth DATE NULL,
  mobile_number VARCHAR(20) NOT NULL, whatsapp_number VARCHAR(20) NULL,
  aadhaar_number CHAR(12) NOT NULL, occupation VARCHAR(150) NULL, education VARCHAR(150) NULL,
  address VARCHAR(500) NULL, village_id BIGINT UNSIGNED NULL, taluka_id BIGINT UNSIGNED NULL,
  district VARCHAR(120) NOT NULL DEFAULT 'Ratnagiri', pincode VARCHAR(10) NULL,
  registration_date DATE NOT NULL, worker_card_number VARCHAR(100) NULL,
  card_issue_date DATE NULL, card_expiry_date DATE NULL, physical_verification_date DATE NULL,
  nominee_name VARCHAR(200) NULL, nominee_relation VARCHAR(100) NULL,
  bank_name VARCHAR(150) NULL, branch_name VARCHAR(150) NULL, account_number VARCHAR(50) NULL, ifsc_code VARCHAR(20) NULL,
  remarks TEXT NULL,
  current_status ENUM('active','pending','inactive','expired','verification_pending') NOT NULL DEFAULT 'pending',
  created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_workers_code(worker_code), UNIQUE KEY uq_workers_aadhaar(aadhaar_number),
  UNIQUE KEY uq_workers_card(worker_card_number), KEY idx_workers_mobile(mobile_number), KEY idx_workers_name(first_name,last_name),
  KEY idx_workers_taluka_village(taluka_id,village_id), KEY idx_workers_status(current_status), KEY idx_workers_expiry(card_expiry_date),
  CONSTRAINT fk_workers_village_taluka FOREIGN KEY(village_id,taluka_id) REFERENCES villages(id,taluka_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_workers_created_by FOREIGN KEY(created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_workers_updated_by FOREIGN KEY(updated_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS worker_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, worker_id BIGINT UNSIGNED NOT NULL,
  document_type ENUM('photo','aadhaar','worker_card','bank_passbook','scholarship','claim','income_certificate','residence_certificate','other') NOT NULL,
  original_name VARCHAR(255) NOT NULL, storage_path VARCHAR(500) NOT NULL, mime_type VARCHAR(120) NOT NULL, file_size INT UNSIGNED NOT NULL,
  created_by BIGINT UNSIGNED NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id), KEY idx_documents_worker_type(worker_id,document_type),
  CONSTRAINT fk_documents_worker FOREIGN KEY(worker_id) REFERENCES workers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_documents_user FOREIGN KEY(created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS card_renewals (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, worker_id BIGINT UNSIGNED NOT NULL, application_date DATE NOT NULL, approval_date DATE NULL, expiry_date DATE NULL,
 status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending', remarks TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_renewals_worker_status(worker_id,status), CONSTRAINT fk_renewals_worker FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS physical_verifications (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, worker_id BIGINT UNSIGNED NOT NULL, verification_date DATE NULL,
 status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending', verified_by BIGINT UNSIGNED NULL, remarks TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_verification_worker_status(worker_id,status), CONSTRAINT fk_verification_worker FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE,
 CONSTRAINT fk_verification_user FOREIGN KEY(verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS scholarships (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, worker_id BIGINT UNSIGNED NOT NULL, scheme_id BIGINT UNSIGNED NULL, student_name VARCHAR(200) NULL,
 academic_year VARCHAR(20) NULL, amount DECIMAL(12,2) NULL, status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending', remarks TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id), KEY idx_scholarship_worker_status(worker_id,status), CONSTRAINT fk_scholarship_worker FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE,
 CONSTRAINT fk_scholarship_scheme FOREIGN KEY(scheme_id) REFERENCES schemes(id) ON DELETE SET NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notifications (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, user_id BIGINT UNSIGNED NULL, title VARCHAR(200) NOT NULL, message TEXT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id), KEY idx_notifications_user_read(user_id,is_read),
 CONSTRAINT fk_notifications_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
