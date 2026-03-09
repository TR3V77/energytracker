-- =============================================
-- Schema Cleanup and Column Updates
-- Removes unused tables and columns and renames
-- columns to match the updated schema.
-- =============================================


-- =============================================
-- DROP UNUSED COLUMNS FROM energy_records
-- Drop upload_id before dropping uploads table
-- because of the foreign key dependency.
-- =============================================

ALTER TABLE energy_records
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS upload_id,
DROP COLUMN IF EXISTS num_households,
DROP COLUMN IF EXISTS renewable_kwh,
DROP COLUMN IF EXISTS energy_type;


-- =============================================
-- DROP UNUSED COLUMNS FROM neighborhoods
-- =============================================

ALTER TABLE neighborhoods
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS city;


-- =============================================
-- DROP UNUSED TABLES
-- uploads can be removed after upload_id is dropped
-- =============================================
ALTER TABLE uploads
DROP COLUMN IF EXISTS id,
DROP COLUMN IF EXISTS filename,
DROP COLUMN IF EXISTS file_type,
DROP COLUMN IF EXISTS record_count,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS errors,
DROP COLUMN IF EXISTS uploaded_at;

DROP TABLE IF EXISTS uploads;


-- =============================================
-- RENAME COLUMN IN energy_records
-- consumption_kwh -> total_kwh
-- =============================================

ALTER TABLE energy_records
RENAME COLUMN consumption_kwh TO total_kwh;