-- Optional starter master data. Run this after 01_schema.sql.

USE bandhkam_kamgar_db;

INSERT INTO categories (name) VALUES
  ('General'),
  ('OBC'),
  ('SC'),
  ('ST')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Add official benefit types after confirmation from the office.
-- Example:
-- INSERT INTO benefit_types (name) VALUES ('Educational Assistance');
