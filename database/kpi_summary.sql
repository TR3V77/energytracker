-- =============================================
-- KPI Summary Metrics Query
-- This query calculates key performance indicators (KPIs)
-- used in the Energy Tracker Dashboard.
--
-- The metrics returned include:
-- • Total energy consumption (kWh)
-- • Number of neighborhoods included in the results
-- • Earliest and latest date in the filtered dataset
-- • Average energy consumption per day
--
-- The query supports filtering by time window and neighborhood.
-- These filters are controlled by API parameters passed from
-- the backend (Flask + SQLAlchemy).
-- =============================================

SELECT

  -- Calculates the total energy usage across all filtered records.
  -- COALESCE ensures that if no rows exist, the result returns 0
  -- instead of NULL so the dashboard can display a value.
  COALESCE(SUM(er.total_kwh), 0) AS total_kwh,

  -- Counts the number of unique neighborhoods included
  -- in the filtered dataset.
  COUNT(DISTINCT er.neighborhood_id) AS neighborhood_count,

  -- Finds the earliest date in the filtered data.
  -- Used to determine the start of the dataset range.
  MIN(er.date) AS start_date,

  -- Finds the most recent date in the filtered data.
  -- Used to determine the end of the dataset range.
  MAX(er.date) AS end_date,

  -- Calculates the average energy usage per day.
  -- If no data exists (MIN(date) is NULL), return 0.
  -- Otherwise divide total energy usage by the number
  -- of days in the dataset range.
  CASE
    WHEN MIN(er.date) IS NULL THEN 0
    ELSE ROUND(
      SUM(er.total_kwh) / GREATEST((MAX(er.date) - MIN(er.date) + 1), 1),
      2
    )
  END AS avg_kwh_per_day

FROM energy_records er

WHERE

  -- Time window filter controlled by the API parameter "window".
  -- "30d" → include only the last 30 days of data
  -- "90d" → include only the last 90 days of data
  -- "all" → include the entire dataset
  (
    (:window = '30d' AND er.date >= CURRENT_DATE - INTERVAL '30 days')
    OR (:window = '90d' AND er.date >= CURRENT_DATE - INTERVAL '90 days')
    OR (:window = 'all')
  )

  AND

  -- Neighborhood filter controlled by the API parameter "neighborhoodId".
  -- If the parameter is NULL, results include all neighborhoods.
  -- Otherwise results are filtered to the specified neighborhood.
  (
    :neighborhood_id IS NULL
    OR er.neighborhood_id = :neighborhood_id
  );