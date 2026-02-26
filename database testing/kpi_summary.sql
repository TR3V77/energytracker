-- =============================================
-- QUERY: Verify KPI Summary Metrics
-- This query calculates key performance indicators (KPIs)
-- from the energy_records table for dashboard and reporting validation.
--
-- SUM(total_kwh):
--   Calculates the total energy consumption across all records.
--   Used to verify overall energy usage in the dataset.
--
-- COUNT(DISTINCT neighborhood_id):
--   Counts the number of unique neighborhoods included in the dataset.
--   Helps confirm correct neighborhood coverage.
--
-- MIN(date):
--   Returns the earliest date in the dataset.
--   Used to verify the start of the data collection period.
--
-- MAX(date):
--   Returns the most recent date in the dataset.
--   Used to verify the end of the data collection period.
--
-- This query is useful for validating dataset completeness,
-- backend API responses, and dashboard KPI accuracy.
-- =============================================
SELECT
  SUM(total_kwh) AS total_kwh,
  COUNT(DISTINCT neighborhood_id) AS neighborhood_count,
  MIN(date) AS start_date,
  MAX(date) AS end_date
FROM energy_records;