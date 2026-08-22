-- Ratnagiri District General Workers Union MIS Portal
-- Phase 2: MySQL database schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS bandhkam_kamgar_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bandhkam_kamgar_db;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(255) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_active (role, is_active)
) ENGINE=InnoDB;

CREATE TABLE talukas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_talukas_name (name)
) ENGINE=InnoDB;

CREATE TABLE villages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  taluka_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_villages_taluka_name (taluka_id, name),
  UNIQUE KEY uq_villages_id_taluka (id, taluka_id),
  KEY idx_villages_taluka (taluka_id),
  CONSTRAINT fk_villages_taluka
    FOREIGN KEY (taluka_id) REFERENCES talukas (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tfc_centers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  taluka_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  address VARCHAR(500) NULL,
  contact_number VARCHAR(20) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tfc_centers_taluka_name (taluka_id, name),
  KEY idx_tfc_centers_taluka (taluka_id),
  CONSTRAINT fk_tfc_centers_taluka
    FOREIGN KEY (taluka_id) REFERENCES talukas (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Lookup tables keep category and benefit type values consistent across imports.
CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE benefit_types (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_benefit_types_name (name)
) ENGINE=InnoDB;

CREATE TABLE applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_sr_no INT UNSIGNED NULL COMMENT 'SR No from the imported Excel row',
  applicant_name VARCHAR(200) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  aadhaar_number CHAR(12) NOT NULL,
  category_id BIGINT UNSIGNED NULL,
  village_id BIGINT UNSIGNED NULL,
  taluka_id BIGINT UNSIGNED NULL,
  form_type ENUM('new_registration', 'renewal', 'benefit_form') NOT NULL,
  form_filled_date DATE NULL,
  physical_document_verification_date DATE NULL,
  attendance_status ENUM('present', 'absent', 'not_applicable') NOT NULL DEFAULT 'not_applicable',
  tfc_center_id BIGINT UNSIGNED NULL,
  reference_by VARCHAR(150) NULL,
  registration_number VARCHAR(100) NULL,
  registration_date DATE NULL,
  benefit_type_id BIGINT UNSIGNED NULL,
  status ENUM('pending', 'registered', 'approved', 'rejected', 'absent') NOT NULL DEFAULT 'pending',
  remarks TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_applications_aadhaar (aadhaar_number),
  UNIQUE KEY uq_applications_registration_number (registration_number),
  KEY idx_applications_source_sr_no (source_sr_no),
  KEY idx_applications_mobile_number (mobile_number),
  KEY idx_applications_status (status),
  KEY idx_applications_form_type (form_type),
  KEY idx_applications_taluka_village (taluka_id, village_id),
  KEY idx_applications_tfc_center (tfc_center_id),
  KEY idx_applications_category (category_id),
  KEY idx_applications_benefit_type (benefit_type_id),
  CONSTRAINT fk_applications_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_applications_village_taluka
    FOREIGN KEY (village_id, taluka_id) REFERENCES villages (id, taluka_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_applications_tfc_center
    FOREIGN KEY (tfc_center_id) REFERENCES tfc_centers (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_applications_benefit_type
    FOREIGN KEY (benefit_type_id) REFERENCES benefit_types (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_applications_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_applications_updated_by
    FOREIGN KEY (updated_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  old_values JSON NULL,
  new_values JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_user_created (user_id, created_at),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;
