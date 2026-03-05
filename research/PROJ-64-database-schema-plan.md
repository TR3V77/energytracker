# Story: Solidify Database Schema & Documentation

## Overview

The current database schema has inconsistencies between the SQL DDL files, SQLAlchemy models, and testing queries. This story covers aligning everything, adding missing relationships, and producing a visual ER diagram.

## Requirements

1. Database schema must be fully documented and visualizable (ER diagram)
2. SQL DDL files must match the actual SQLAlchemy models (single source of truth)
3. All tables must have proper foreign key relationships (no orphaned tables)
4. Testing/query scripts must reference correct column names
5. Database must support traceability of uploaded data back to its source file

## Current Issues

- `database/Tables.sql` uses `total_kwh` but SQLAlchemy model uses `consumption_kwh`
- `energy_type` column exists in the model but not in `Tables.sql`
- `uploads` table only exists in SQLAlchemy — no DDL definition
- No FK between `uploads` and `energy_records` (commented out in code)
- `database testing/*.sql` queries still reference `total_kwh`

## Subtasks

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 1 | PROJ-64 (done) | Document database schema with DBML | Small |
| 2 | Sync Tables.sql with SQLAlchemy models | Rename `total_kwh` to `consumption_kwh`, add `energy_type` column to DDL | Small |
| 3 | Add `uploads` table to Tables.sql | The `uploads` table only exists in SQLAlchemy — needs a DDL definition | Small |
| 4 | Link `uploads` to `energy_records` via FK | Add `upload_id` FK on `energy_records` so records are traceable to their upload source | Medium |
| 5 | Update testing SQL queries | `database testing/*.sql` still references `total_kwh` — update to `consumption_kwh` | Small |
| 6 | Generate ER diagram from DBML | Export visual diagram from dbdiagram.io and add to repo/README | Small |

## Current Schema (3 tables)

```
neighborhoods (neighborhood_id PK, neighborhood_name, households)
    │
    └──< energy_records (id PK, neighborhood_id FK, date, consumption_kwh, energy_type)

uploads (id PK, filename, file_type, record_count, status, errors, uploaded_at)
    └── (no FK to energy_records yet)
```

## Notes

- DBML file is at `database/schema.dbml` — paste into https://dbdiagram.io to visualize
- Tasks 2, 3, and 5 are quick fixes any teammate can pick up
- Task 4 requires a model change + migration (meatier work)
- Task 6 should be done last, after all schema changes are finalized
