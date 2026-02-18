# Energy Tracker — Project Scaffolding Plan

## Context

The repo currently has only README.md, ROADMAP.md, .gitignore, and a logo image — no code yet. This plan scaffolds the full-stack project (Flask + React + PostgreSQL + Docker) in small, incremental commits on the `feature/project-scaffolding` branch. Each commit is focused on one concern and leaves the repo in a working state.

## Directory Structure (end state)

```
energytracker/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .flaskenv
│   ├── config.py
│   ├── app/
│   │   ├── __init__.py          # App factory (create_app)
│   │   ├── extensions.py        # db, migrate instances
│   │   ├── models/
│   │   │   ├── neighborhood.py
│   │   │   ├── energy_record.py
│   │   │   └── upload.py
│   │   ├── routes/
│   │   │   ├── health.py        # GET /api/health
│   │   │   ├── upload.py        # POST /api/upload
│   │   │   ├── neighborhoods.py # GET /api/neighborhoods
│   │   │   └── energy.py        # GET /api/energy
│   │   ├── services/
│   │   │   ├── upload_service.py
│   │   │   └── energy_service.py
│   │   └── utils/
│   │       └── validators.py
│   └── tests/
│       ├── conftest.py
│       ├── test_health.py
│       └── test_upload.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js
        ├── App.js / App.css
        ├── components/
        │   ├── Navbar.js
        │   └── FileUpload.js
        ├── pages/
        │   ├── Home.js
        │   ├── Dashboard.js
        │   ├── Upload.js
        │   └── Compare.js
        └── services/
            └── api.js
```

## Database Schema

### neighborhoods
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | PK |
| name | String(255) | NOT NULL, UNIQUE |
| city | String(255) | NOT NULL, default="Austin" |
| created_at | DateTime | NOT NULL, default=now |

### energy_records
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | PK |
| neighborhood_id | Integer | FK → neighborhoods.id |
| date | Date | NOT NULL |
| consumption_kwh | Float | NOT NULL |
| renewable_kwh | Float | nullable, default=0 |
| num_households | Integer | nullable |
| upload_id | Integer | FK → uploads.id |
| created_at | DateTime | NOT NULL, default=now |

Index: composite on (neighborhood_id, date)

### uploads
| Column | Type | Notes |
|--------|------|-------|
| id | Integer | PK |
| filename | String(255) | NOT NULL |
| file_type | String(10) | "csv" or "json" |
| record_count | Integer | NOT NULL |
| status | String(20) | "completed", "failed", "partial" |
| errors | Text | nullable, JSON string |
| uploaded_at | DateTime | NOT NULL, default=now |

## Commit Sequence

### Commit 1: Update .gitignore for full-stack Python/React/Docker project
- Replace the generic Bitbucket .gitignore with proper rules for Python, Node, Docker, IDE files, .env

### Commit 2: Add backend directory structure with Flask app factory skeleton
- `backend/` with requirements.txt, config.py, .flaskenv
- App factory (`create_app`), extensions.py (db, migrate)
- Empty model/service/util packages
- Health check route (`GET /api/health`)
- Test fixtures and test_health.py

### Commit 3: Add Docker configuration for multi-service development environment
- `docker-compose.yml` (PostgreSQL, backend, frontend services)
- `backend/Dockerfile`

### Commit 4: Add SQLAlchemy models for neighborhoods, energy records, and uploads
- Full model definitions with `to_dict()` serialization methods
- Composite index on (neighborhood_id, date)

### Commit 5: Add backend API route stubs for upload, neighborhoods, and energy data
- Stub routes returning 501 with placeholder responses
- Register all blueprints

### Commit 6: Add frontend React application scaffold with routing and page stubs
- React app with react-router-dom routing to 4 pages
- Navbar, stub pages, api.js service wrapper
- `frontend/Dockerfile`

### Commit 7: Add FileUpload component with CSV/JSON file selection
- File picker with type validation (CSV/JSON only)
- Wire into Upload page

### Commit 8: Implement backend upload service with CSV/JSON parsing and validation
- CSV/JSON parsing, row validation, Neighborhood + EnergyRecord creation
- Replace upload route stub with real implementation
- Unit tests

### Commit 9: Implement neighborhoods and energy data query endpoints
- energy_service.py with filtering by neighborhood and date range
- Replace stub routes with real implementations

### Commit 10: Wire frontend Upload page to backend API and add error handling
- Connect FileUpload → api.uploadFile() → display results/errors
- Complete end-to-end upload flow

## What's Left for Later Sprints
- Dashboard page with charts (Sprint 2)
- Compare page with neighborhood comparison (Sprint 2)
- Hotspot identification logic (Sprint 3)
- Reporting/export (Sprint 3)
- AWS S3 integration (Sprint 3)
- Styling and polish (Sprint 3)
