-- =============================================
-- QUERY: Verify Daily Energy Aggregation
-- This query checks that daily aggregation is working correctly.
-- It groups energy records by exact date (without DATE_TRUNC).
-- SUM(total_kwh) calculates the total energy usage for each date.
-- This helps verify data integrity and confirms aggregation accuracy.
-- ORDER BY ASC sorts results from oldest to newest for easier inspection.
-- LIMIT 10 restricts output to the first 10 records for quick testing.
-- Useful for debugging, validation, and confirming correct data import.
-- =============================================
SELECT
  date,
  SUM(total_kwh) AS kwh
FROM energy_records
GROUP BY date
ORDER BY date ASC
LIMIT 10;