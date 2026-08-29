-- Phase 7: additive Google Sheets synchronization state. Existing records are preserved.
USE bandhkam_kamgar_db;
CREATE TABLE IF NOT EXISTS google_sync_runs (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, import_history_id BIGINT UNSIGNED NULL, spreadsheet_id VARCHAR(128) NOT NULL,
 workbook_name VARCHAR(255) NULL, sheets_total INT UNSIGNED NOT NULL DEFAULT 0, triggered_by BIGINT UNSIGNED NULL,
 trigger_type ENUM('manual','scheduled') NOT NULL, status ENUM('running','success','partial','failed') NOT NULL DEFAULT 'running',
 started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, completed_at TIMESTAMP NULL, duration_ms INT UNSIGNED NULL, error_message VARCHAR(1000) NULL,
 PRIMARY KEY(id), KEY idx_google_sync_runs_status_date(status,started_at), CONSTRAINT fk_google_sync_history FOREIGN KEY(import_history_id) REFERENCES import_history(id) ON DELETE SET NULL, CONSTRAINT fk_google_sync_user FOREIGN KEY(triggered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS google_sheet_sync_details (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, google_sync_run_id BIGINT UNSIGNED NOT NULL, sheet_name VARCHAR(255) NOT NULL, rows_read INT UNSIGNED NOT NULL DEFAULT 0, inserted_count INT UNSIGNED NOT NULL DEFAULT 0, updated_count INT UNSIGNED NOT NULL DEFAULT 0, skipped_count INT UNSIGNED NOT NULL DEFAULT 0, duplicate_count INT UNSIGNED NOT NULL DEFAULT 0, failed_count INT UNSIGNED NOT NULL DEFAULT 0, status ENUM('success','partial','failed','ignored') NOT NULL, error_message VARCHAR(1000) NULL,
 PRIMARY KEY(id), KEY idx_google_sheet_details_run(google_sync_run_id), CONSTRAINT fk_google_sheet_details_run FOREIGN KEY(google_sync_run_id) REFERENCES google_sync_runs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
