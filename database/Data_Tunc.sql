-- =============================================
<<<<<<< HEAD
-- QUERY: Daily Energy Consumption Aggregation
-- This query calculates the total energy usage per day.
-- DATE_TRUNC('day', date) removes the time portion and groups records by calendar day.
-- SUM(total_kwh) calculates the total kilowatt-hours consumed for each day.
-- GROUP BY ensures all records from the same day are combined.
-- ORDER BY ASC sorts results from oldest to newest for time-series visualization.
-- Used for daily trends in dashboards and analytics.
=======
-- Daily Energy Aggregation with Filters
-- Used when granularity = "day"
-- This query aggregates total energy usage per day
-- and applies optional filters for time window
-- and neighborhood selection.
>>>>>>> 2fc0a69 (PROJ-53: Add time window and neighborhood filters to energy aggregation queries)
-- =============================================

SELECT 
<<<<<<< HEAD
    DATE_TRUNC('day', date) AS day,
    SUM(total_kwh) AS total_kwh
=======
    -- DATE_TRUNC removes any time component and groups
    -- records by calendar day for daily aggregation
    DATE_TRUNC('day', date) AS period,

    -- SUM calculates the total energy consumption (kWh)
    -- for all records within each grouped day
    SUM(total_kwh) AS kwh

>>>>>>> 2fc0a69 (PROJ-53: Add time window and neighborhood filters to energy aggregation queries)
FROM public.energy_records

WHERE
    -- Window filter: restricts results to the selected time range
    -- "30d" → last 30 days
    -- "90d" → last 90 days
    -- "all" → no date filtering
    (
        (:window = '30d' AND date >= CURRENT_DATE - INTERVAL '30 days')
        OR (:window = '90d' AND date >= CURRENT_DATE - INTERVAL '90 days')
        OR (:window = 'all')
    )

AND
    -- Neighborhood filter:
    -- If neighborhood_id is NULL, return all neighborhoods
    -- Otherwise filter results to the specified neighborhood
    (
        :neighborhood_id IS NULL
        OR neighborhood_id = :neighborhood_id
    )

-- GROUP BY ensures records from the same day are aggregated together
GROUP BY period

-- ORDER BY sorts results chronologically for time-series visualization
ORDER BY period ASC;



-- =============================================
<<<<<<< HEAD
-- QUERY: Weekly Energy Consumption Aggregation
-- This query calculates the total energy usage per week.
-- DATE_TRUNC('week', date) groups all records into their respective calendar week.
-- SUM(total_kwh) calculates total weekly energy consumption.
-- GROUP BY combines all records within the same week.
-- ORDER BY ASC sorts results chronologically for trend analysis.
-- Used for weekly summaries, reporting, and long-term energy analysis.
=======
-- Weekly Energy Aggregation with Filters
-- Used when granularity = "week"
-- This query aggregates total energy usage per week
-- and applies optional filters for time window
-- and neighborhood selection.
>>>>>>> 2fc0a69 (PROJ-53: Add time window and neighborhood filters to energy aggregation queries)
-- =============================================

SELECT 
<<<<<<< HEAD
    DATE_TRUNC('week', date) AS week,
    SUM(total_kwh) AS total_kwh
=======
    -- DATE_TRUNC groups records into calendar weeks
    -- (week starting Monday in PostgreSQL)
    DATE_TRUNC('week', date) AS period,

    -- SUM calculates total energy consumption for each week
    SUM(total_kwh) AS kwh

>>>>>>> 2fc0a69 (PROJ-53: Add time window and neighborhood filters to energy aggregation queries)
FROM public.energy_records

WHERE
    -- Window filter: restrict results to the selected time range
    -- "30d" → last 30 days
    -- "90d" → last 90 days
    -- "all" → includes the full dataset
    (
        (:window = '30d' AND date >= CURRENT_DATE - INTERVAL '30 days')
        OR (:window = '90d' AND date >= CURRENT_DATE - INTERVAL '90 days')
        OR (:window = 'all')
    )

AND
    -- Neighborhood filter:
    -- If no neighborhood is specified, include all neighborhoods
    -- Otherwise filter results by the provided neighborhood_id
    (
        :neighborhood_id IS NULL
        OR neighborhood_id = :neighborhood_id
    )

-- GROUP BY aggregates records by week
GROUP BY period

-- ORDER BY ensures results are returned in chronological order
ORDER BY period ASC;