CREATE TABLE IF NOT EXISTS neighborhoods (
  neighborhood_id INT PRIMARY KEY,
  neighborhood_name TEXT NOT NULL,
  households INT NOT NULL CHECK (households > 0)
);

CREATE TABLE IF NOT EXISTS energy_records (
  id SERIAL PRIMARY KEY,
  neighborhood_id INT NOT NULL REFERENCES neighborhoods(neighborhood_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_kwh NUMERIC(12,2) NOT NULL CHECK (total_kwh >= 0)
);

CREATE INDEX IF NOT EXISTS idx_energy_records_date
  ON energy_records(date);

CREATE INDEX IF NOT EXISTS idx_energy_records_neighborhood_date
  ON energy_records(neighborhood_id, date);