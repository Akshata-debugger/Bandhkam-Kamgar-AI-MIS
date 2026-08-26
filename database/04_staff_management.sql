USE bandhkam_kamgar_db;

-- Idempotent migration for MySQL versions without ADD COLUMN IF NOT EXISTS.
DROP PROCEDURE IF EXISTS apply_staff_management_migration;
DELIMITER $$
CREATE PROCEDURE apply_staff_management_migration()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='mobile_number') THEN
    ALTER TABLE users ADD COLUMN mobile_number VARCHAR(20) NULL AFTER email;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='last_login_at') THEN
    ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL AFTER is_active;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name='users' AND index_name='uq_users_mobile_number') THEN
    ALTER TABLE users ADD UNIQUE INDEX uq_users_mobile_number (mobile_number);
  END IF;
END$$
DELIMITER ;
CALL apply_staff_management_migration();
DROP PROCEDURE apply_staff_management_migration;
