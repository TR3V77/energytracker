-- Auto-runs on first docker compose up (fresh volume only)
-- Creates tables and seeds neighborhood data with geographic coordinates

CREATE TABLE IF NOT EXISTS neighborhoods (
  neighborhood_id INT PRIMARY KEY,
  neighborhood_name TEXT NOT NULL,
  households INT NOT NULL CHECK (households > 0),
  zip_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
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

INSERT INTO neighborhoods (neighborhood_id, neighborhood_name, households, zip_code, latitude, longitude) VALUES
  (1, 'Downtown San Marcos', 302, '78666', 29.8833, -97.9414),
  (2, 'Riverside', 635, '78666', 29.8750, -97.9300),
  (3, 'Blanco Gardens', 470, '78666', 29.8950, -97.9450),
  (4, 'Uhland', 306, '78640', 29.9650, -97.7850),
  (5, 'Kyle', 414, '78640', 29.9888, -97.8772),
  (6, 'Wimberley', 220, '78676', 29.9974, -98.0986),
  (7, 'Buda', 321, '78610', 30.0852, -97.8419),
  (8, 'New Braunfels', 666, '78130', 29.7030, -98.1245),
  (9, 'Martindale', 271, '78655', 29.8463, -97.8408),
  (10, 'Lockhart', 530, '78644', 29.8849, -97.6700)
ON CONFLICT (neighborhood_id) DO NOTHING;
