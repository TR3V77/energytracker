# Energy Tracker Dashboard API Contract

## Overview

This document defines the API contract and database query strategy for the Energy Tracker Dashboard.

The dashboard allows users to:
- View energy usage trends over time
- See summary KPI metrics
- Filter results by time window and neighborhood
- Switch aggregation granularity (daily vs weekly)

---

## Backend Technologies

- FastAPI
- PostgreSQL
- SQLAlchemy 2.0
- Docker

---

## Database Tables

### neighborhoods
- `neighborhood_id` (INT, PK)
- `neighborhood_name` (TEXT, NOT NULL)
- `households` (INT, NOT NULL)

### energy_records
- `id` (SERIAL, PK)
- `neighborhood_id` (INT, FK → neighborhoods.neighborhood_id)
- `date` (DATE, NOT NULL)
- `total_kwh` (NUMERIC(12,2), NOT NULL)

---

## Endpoint

### GET `/api/dashboard`

Returns dashboard KPI metrics and aggregated time-series energy usage data.

---

## Query Parameters

| Parameter | Type | Default | Description |
|----------|------|---------|-------------|
| window | string | `"90d"` | Time filter: `"30d"`, `"90d"`, `"all"` |
| neighborhoodId | integer or `"all"` | `"all"` | Filter by specific neighborhood ID |
| granularity | string | `"day"` | Aggregation level: `"day"` or `"week"` |

---

## Parameter Behavior & Validation

### `window`
- `"30d"` → last 30 days relative to `CURRENT_DATE`
- `"90d"` → last 90 days relative to `CURRENT_DATE`
- `"all"` → no date filter (entire dataset)

Invalid values → **400 Bad Request**

### `neighborhoodId`
- `"all"` → includes all neighborhoods
- integer → filters results to the specified neighborhood

If a specific neighborhoodId is provided but does not exist → **404 Not Found**

### `granularity`
- `"day"` → aggregated by calendar day
- `"week"` → aggregated by week start date using `DATE_TRUNC('week', ...)`

Invalid values → **400 Bad Request**

---

## Response Format

All successful responses include:
- `generatedAt` (UTC timestamp)
- `unit` (`"kwh"`)
- `filters` (echoed request parameters)

---

## Case 1: Data Exists

```json

{
  "has_data": true,
  "generated_at": "2026-02-26T18:05:12Z",
  "unit": "kwh",
  "filters": {
    "window": "90d",
    "neighborhood_id": "all",
    "granularity": "day"
  },
  "kpis": {
    "total_kwh": 123456.78,
    "avg_kwh_per_day": 1371.74,
    "neighborhood_count": 10,
    "date_range": {
      "start": "2025-01-01",
      "end": "2025-12-31"
    }
  },
  "timeseries": [
    { "period": "2025-01-01", "kwh": 1320.50 },
    { "period": "2025-01-02", "kwh": 1289.33 }
  ]
}
```

## Case 2: No Data Exists

```json
{
  "has_data": false,
  "generated_at": "2026-02-26T18:05:12Z",
  "unit": "kwh",
  "message": "No dashboard data found for the selected filters.",
  "filters": {
    "window": "90d",
    "neighborhood_id": "all",
    "granularity": "day"
  }
}
```