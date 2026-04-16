-- Migration: Add geographic data to neighborhoods
-- Safe to run multiple times (idempotent)
-- Run: docker exec -i energytracker-db-1 psql -U energytracker energy_tracker < database/migrate-add-geo.sql

ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

UPDATE neighborhoods SET neighborhood_name='Downtown San Marcos', zip_code='78666', latitude=29.8833, longitude=-97.9414 WHERE neighborhood_id=1;
UPDATE neighborhoods SET neighborhood_name='Riverside', zip_code='78666', latitude=29.8750, longitude=-97.9300 WHERE neighborhood_id=2;
UPDATE neighborhoods SET neighborhood_name='Blanco Gardens', zip_code='78666', latitude=29.8950, longitude=-97.9450 WHERE neighborhood_id=3;
UPDATE neighborhoods SET neighborhood_name='Uhland', zip_code='78640', latitude=29.9650, longitude=-97.7850 WHERE neighborhood_id=4;
UPDATE neighborhoods SET neighborhood_name='Kyle', zip_code='78640', latitude=29.9888, longitude=-97.8772 WHERE neighborhood_id=5;
UPDATE neighborhoods SET neighborhood_name='Wimberley', zip_code='78676', latitude=29.9974, longitude=-98.0986 WHERE neighborhood_id=6;
UPDATE neighborhoods SET neighborhood_name='Buda', zip_code='78610', latitude=30.0852, longitude=-97.8419 WHERE neighborhood_id=7;
UPDATE neighborhoods SET neighborhood_name='New Braunfels', zip_code='78130', latitude=29.7030, longitude=-98.1245 WHERE neighborhood_id=8;
UPDATE neighborhoods SET neighborhood_name='Martindale', zip_code='78655', latitude=29.8463, longitude=-97.8408 WHERE neighborhood_id=9;
UPDATE neighborhoods SET neighborhood_name='Lockhart', zip_code='78644', latitude=29.8849, longitude=-97.6700 WHERE neighborhood_id=10;
