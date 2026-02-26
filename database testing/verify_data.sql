-- Verify neighborhoods imported correctly
SELECT COUNT(*) FROM neighborhoods;

-- Verify energy records imported correctly
SELECT COUNT(*) FROM energy_records;

-- Preview sample data
SELECT * FROM energy_records LIMIT 10;