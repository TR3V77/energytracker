-- =============================================
-- TABLE: neighborhoods
-- Stores basic information about each neighborhood.
-- Each neighborhood has a unique ID, name, and number of households.
-- The households field must be greater than 0 to ensure valid data.
-- =============================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  neighborhood_id INT PRIMARY KEY,
  neighborhood_name TEXT NOT NULL,
  households INT NOT NULL CHECK (households > 0),
  zip_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);


-- =============================================
-- TABLE: energy_records
-- Stores daily energy consumption data for each neighborhood.
-- Links to neighborhoods table using neighborhood_id (foreign key).
-- ON DELETE CASCADE ensures energy records are removed if a neighborhood is deleted.
-- total_kwh stores total energy usage in kilowatt-hours and cannot be negative.
-- SERIAL automatically generates a unique ID for each record.
-- =============================================
CREATE TABLE IF NOT EXISTS energy_records (
  id SERIAL PRIMARY KEY,
  neighborhood_id INT NOT NULL REFERENCES neighborhoods(neighborhood_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_kwh NUMERIC(12,2) NOT NULL CHECK (total_kwh >= 0)
);


-- =============================================
-- INDEX: idx_energy_records_date
-- Improves performance for queries filtering or aggregating by date.
-- Useful for daily and weekly energy analysis.
-- =============================================
CREATE INDEX IF NOT EXISTS idx_energy_records_date
  ON energy_records(date);


-- =============================================
-- INDEX: idx_energy_records_neighborhood_date
-- Improves performance for queries filtering by neighborhood and date.
-- Especially useful for dashboard queries and time-series analysis per neighborhood.
-- =============================================
CREATE INDEX IF NOT EXISTS idx_energy_records_neighborhood_date
  ON energy_records(neighborhood_id, date);