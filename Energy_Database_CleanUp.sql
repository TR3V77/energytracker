-- =============================================
-- Schema Cleanup and Column Updates
-- Removes unused tables and columns and renames
-- columns to match the updated database schema.
-- =============================================

-- =============================================
-- DROP UNUSED TABLES
-- These tables are no longer required in the system.
-- =============================================

DROP TABLE IF EXISTS uploads;


-- =============================================
-- DROP UNUSED COLUMNS FROM energy_records
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
-- RENAME COLUMN IN energy_records
-- Davos change: consumption_kwh -> total_kwh
-- =============================================

ALTER TABLE energy_records
RENAME COLUMN consumption_kwh TO total_kwh;