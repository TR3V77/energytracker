ALTER TABLE neighborhoods
ADD CONSTRAINT neighborhoods_households_check
CHECK (households > 0);

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'neighborhoods_households_check';

ALTER TABLE energy_records
ADD CONSTRAINT energy_records_total_kwh_check
CHECK ((total_kwh >= (0)::numeric));

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'energy_records_total_kwh_check';