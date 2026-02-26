-- =============================================
-- QUERY: Daily Energy Consumption Aggregation
-- This query calculates the total energy usage per day.
-- DATE_TRUNC('day', date) removes the time portion and groups records by calendar day.
-- SUM(total_kwh) calculates the total kilowatt-hours consumed for each day.
-- GROUP BY ensures all records from the same day are combined.
-- ORDER BY ASC sorts results from oldest to newest for time-series visualization.
-- Used for daily trends in dashboards and analytics.
-- =============================================
SELECT 
    DATE_TRUNC('day', date) AS day,
    SUM(total_kwh) AS total_kwh
FROM public.energy_records
GROUP BY day
ORDER BY day ASC;


-- =============================================
-- QUERY: Weekly Energy Consumption Aggregation
-- This query calculates the total energy usage per week.
-- DATE_TRUNC('week', date) groups all records into their respective calendar week.
-- SUM(total_kwh) calculates total weekly energy consumption.
-- GROUP BY combines all records within the same week.
-- ORDER BY ASC sorts results chronologically for trend analysis.
-- Used for weekly summaries, reporting, and long-term energy analysis.
-- =============================================
SELECT 
    DATE_TRUNC('week', date) AS week,
    SUM(total_kwh) AS total_kwh
FROM public.energy_records
GROUP BY week
ORDER BY week ASC;