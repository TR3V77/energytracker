# Story: Solidify Database Schema & Documentation

## Overview

The database schema documentation (DBML) was created when the codebase still had inconsistencies between SQL DDL files and SQLAlchemy models. Those issues have since been resolved (PROJ-53 and PROJ-66). This update aligns the DBML with the actual `energy_tracker` database.

## Current Schema (2 tables)

```
neighborhoods (neighborhood_id PK, neighborhood_name, households)
    │
    └──< energy_records (id PK, neighborhood_id FK, date, total_kwh)
```

- Source of truth: `database/Tables.sql`
- DBML file: `database/schema.dbml` — paste into https://dbdiagram.io to visualize

## What changed

- Removed `consumption_kwh` — real DB column is `total_kwh`
- Removed `energy_type` column — does not exist in real DB
- Removed `uploads` table — does not exist in real DB (upload route is disabled on main)
- DBML now matches `Tables.sql` exactly

## Notes

- Schema-match tests (`backend/tests/test_schema_match.py`) now enforce that Python models stay in sync with `Tables.sql`
- If an `uploads` table is added in the future, update both `Tables.sql` and this DBML
