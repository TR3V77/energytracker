# Energy Tracker — Team Guide

## What Is This Scaffold?

This project has been set up with a working foundation so everyone can start building features immediately. Think of it like a house where the frame, plumbing, and electrical are done — each person just needs to build out their room.

The app is a **web dashboard** that lets city planners upload neighborhood energy data (CSV/JSON files) and visualize consumption trends, compare neighborhoods, and identify problem areas.

---

## How the App Works (Big Picture)

```
[ User's Browser ]  ←→  [ React Frontend :3000 ]  ←→  [ Flask API :5000 ]  ←→  [ PostgreSQL Database :5432 ]
```

1. The **React frontend** is what the user sees — pages, charts, buttons
2. The **Flask backend** is the API — it receives requests, processes data, talks to the database
3. **PostgreSQL** stores everything — neighborhoods, energy readings, upload history
4. **Docker** wraps all three into one command so everyone runs the same setup

---

## Project Structure Explained

```
energytracker/
│
├── docs/                        ← You are here. Team documentation.
│
├── docker-compose.yml           ← Runs all 3 services with one command
│
├── backend/                     ← Python/Flask API (the brain)
│   ├── Dockerfile               ← How to build the backend container
│   ├── requirements.txt         ← Python packages we depend on
│   ├── .flaskenv                ← Tells Flask where the app is
│   ├── config.py                ← Settings for dev/test/production
│   │
│   ├── app/
│   │   ├── __init__.py          ← App factory — creates the Flask app
│   │   ├── extensions.py        ← Database connection setup
│   │   │
│   │   ├── models/              ← DATABASE TABLES (what data looks like)
│   │   │   ├── neighborhood.py  ← Neighborhood table (name, city)
│   │   │   ├── energy_record.py ← Energy readings (kWh, date, etc.)
│   │   │   └── upload.py        ← Upload history (filename, status)
│   │   │
│   │   ├── routes/              ← API ENDPOINTS (URLs the frontend calls)
│   │   │   ├── health.py        ← GET  /api/health
│   │   │   ├── upload.py        ← POST /api/upload
│   │   │   ├── neighborhoods.py ← GET  /api/neighborhoods
│   │   │   └── energy.py        ← GET  /api/energy
│   │   │
│   │   ├── services/            ← BUSINESS LOGIC (the actual work)
│   │   │   ├── upload_service.py    ← Parses files, validates data, saves to DB
│   │   │   └── energy_service.py    ← Queries for neighborhoods and energy data
│   │   │
│   │   └── utils/
│   │       └── validators.py    ← Shared validation helpers (to be built out)
│   │
│   └── tests/                   ← Automated tests (run with pytest)
│       ├── conftest.py          ← Test setup (creates a fake database in memory)
│       ├── test_health.py       ← Tests for health endpoint
│       └── test_upload.py       ← Tests for upload endpoint
│
└── frontend/                    ← React app (the face)
    ├── Dockerfile               ← How to build the frontend container
    ├── package.json             ← JavaScript packages we depend on
    │
    ├── public/
    │   └── index.html           ← The single HTML page React loads into
    │
    └── src/
        ├── index.js             ← Entry point — sets up React Router
        ├── App.js               ← Main layout — defines all page routes
        ├── App.css              ← Global styles (navbar, layout)
        │
        ├── components/          ← REUSABLE UI PIECES
        │   ├── Navbar.js        ← Navigation bar (Home, Dashboard, Upload, Compare)
        │   └── FileUpload.js    ← File picker with CSV/JSON validation
        │
        ├── pages/               ← ONE FILE PER PAGE
        │   ├── Home.js          ← Landing page (placeholder)
        │   ├── Dashboard.js     ← Main dashboard (placeholder — needs charts)
        │   ├── Upload.js        ← Upload page (WORKING — talks to backend)
        │   └── Compare.js       ← Comparison page (placeholder)
        │
        └── services/
            └── api.js           ← All backend API calls in one place
```

---

## What Already Works

| Feature | Status | How to verify |
|---------|--------|---------------|
| Upload a CSV/JSON file | **Working** | Run tests or POST to `/api/upload` |
| Validate uploaded data | **Working** | Missing fields are caught and reported |
| Store data in database | **Working** | Records appear in neighborhoods + energy_records tables |
| List neighborhoods | **Working** | `GET /api/neighborhoods` returns data |
| Query energy data with filters | **Working** | `GET /api/energy?neighborhood_id=1&start_date=2024-01-01` |
| Health check | **Working** | `GET /api/health` returns `{"status": "ok"}` |
| Frontend routing | **Working** | All 4 pages load with navigation |
| Upload page UI | **Working** | File picker validates CSV/JSON, calls backend |
| Dashboard charts | **Not started** | Placeholder text — Sprint 2 |
| Compare view | **Not started** | Placeholder text — Sprint 2 |
| Styling/polish | **Not started** | Minimal CSS only — Sprint 3 |

---

## The Database

Three tables store all our data:

### neighborhoods
Stores each unique neighborhood we have data for.

| Column | What it is | Example |
|--------|-----------|---------|
| id | Auto-generated ID | 1 |
| name | Neighborhood name | "Hyde Park" |
| city | City name | "Austin" |
| created_at | When it was added | 2024-02-16 12:00:00 |

### energy_records
The main data table — one row per neighborhood per date.

| Column | What it is | Example |
|--------|-----------|---------|
| id | Auto-generated ID | 1 |
| neighborhood_id | Links to neighborhoods table | 1 |
| date | Date of the reading | 2024-01-15 |
| consumption_kwh | Total energy used (kilowatt-hours) | 45200.5 |
| renewable_kwh | Renewable energy (optional) | 3200.0 |
| num_households | Number of households (optional) | 1250 |
| upload_id | Which upload brought this in | 1 |

### uploads
Tracks every file that was uploaded (audit trail).

| Column | What it is | Example |
|--------|-----------|---------|
| id | Auto-generated ID | 1 |
| filename | Original file name | "austin_energy_2024.csv" |
| file_type | csv or json | "csv" |
| record_count | How many rows were imported | 150 |
| status | completed, partial, or failed | "completed" |
| errors | Any validation errors (JSON) | null |

### Expected CSV format for uploads
```csv
neighborhood,date,consumption_kwh,renewable_kwh,num_households
Hyde Park,2024-01-15,45200.5,3200.0,1250
Mueller,2024-01-15,38100.0,5600.0,980
East Riverside,2024-01-15,52000.0,1200.0,2100
```

Only `neighborhood`, `date`, and `consumption_kwh` are required. The rest are optional.

---

## API Reference

Every endpoint the frontend can call:

### `GET /api/health`
Returns `{"status": "ok", "service": "energy-tracker-api"}`. Use this to check if the backend is running.

### `POST /api/upload`
Upload a CSV or JSON file. Send as `multipart/form-data` with the file in a field called `file`.

**Success (201):**
```json
{
  "id": 1,
  "filename": "data.csv",
  "file_type": "csv",
  "record_count": 3,
  "status": "completed",
  "uploaded_at": "2024-02-16T12:00:00"
}
```

**Error (400):**
```json
{"error": "No file provided"}
```

### `GET /api/neighborhoods`
Returns all neighborhoods in the database, sorted by name.
```json
[
  {"id": 1, "name": "East Riverside", "city": "Austin"},
  {"id": 2, "name": "Hyde Park", "city": "Austin"},
  {"id": 3, "name": "Mueller", "city": "Austin"}
]
```

### `GET /api/energy`
Returns energy records. Supports optional query parameters:

| Param | Type | Example | Purpose |
|-------|------|---------|---------|
| neighborhood_id | int | `?neighborhood_id=1` | Filter by neighborhood |
| start_date | string | `?start_date=2024-01-01` | Lower bound (YYYY-MM-DD) |
| end_date | string | `?end_date=2024-03-31` | Upper bound (YYYY-MM-DD) |

```json
[
  {
    "id": 1,
    "neighborhood_id": 1,
    "date": "2024-01-15",
    "consumption_kwh": 45200.5,
    "renewable_kwh": 3200.0,
    "num_households": 1250
  }
]
```

---

## How to Run the Project

### Option A: Docker (recommended — everything runs in one command)
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health
- Database: localhost:5432

### Option B: Run manually (without Docker)

**Backend:**
```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/flask run
```
Note: Without Docker, the backend defaults to looking for PostgreSQL at localhost:5432. For quick local testing you can override with SQLite:
```bash
DATABASE_URL=sqlite:///dev.db ./venv/bin/flask run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Running Tests
```bash
cd backend
./venv/bin/python -m pytest tests/ -v
```
Tests use an in-memory SQLite database — no PostgreSQL needed.

---

## Team Roles & Responsibilities

| Role | Responsibility | Key Files |
|------|---------------|-----------|
| **Person 1 — Ingestion Pipeline** | CSV upload → validation → database storage; error handling; schema enforcement | `backend/app/services/upload_service.py`, `backend/app/routes/upload.py`, `backend/app/utils/validators.py` |
| **Person 2 — Analytics Engine** | Aggregation queries, trend calculations, efficiency scoring | `backend/app/services/energy_service.py`, new file: `backend/app/services/analytics_service.py` |
| **Person 3 — Dataset & QA** | Find/create real datasets, define metrics, write tests, documentation | `backend/tests/`, `docs/`, sample data files |
| **Person 4 — Frontend** | Dashboard UI, charts, filters, upload interface, styling | `frontend/src/pages/`, `frontend/src/components/` |
| **Person 5 — Integration & DevOps (Davos)** | Docker, CI/CD, API contracts, deployment, unblocking teammates | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, overall architecture |

### What each person should do first

**Person 1 — Ingestion Pipeline:**
The upload flow already works for basic CSVs. Your job is to make it production-ready:
- Improve validation in `upload_service.py` (handle duplicate records, bad dates, negative values)
- Add support for more CSV column variations (different headers, different date formats)
- Add a `DELETE /api/upload/<id>` endpoint to let users remove bad uploads
- Add more tests to `test_upload.py` for edge cases

**Person 2 — Analytics Engine:**
The raw query endpoint exists. Your job is to add the smart queries:
- Create `backend/app/services/analytics_service.py` with functions for:
  - Aggregate consumption by week/month/quarter
  - Calculate percent change over time (trending up or down?)
  - Compute efficiency: kWh per household
  - Identify top N highest-consumption neighborhoods
- Add new route: `GET /api/analytics/trends?neighborhood_id=1&period=monthly`
- Add new route: `GET /api/analytics/hotspots?limit=5`

**Person 3 — Dataset & QA:**
- Research and pick our primary dataset (Austin Energy, Pecan Street, or US EIA)
- Create sample CSV files in a `data/samples/` folder that match our expected format
- Define what "good data" looks like — document expected ranges, edge cases
- Write tests for the analytics service (once Person 2 builds it)
- Keep `docs/` up to date as things change

**Person 4 — Frontend:**
The page shells and routing are done. Your job is to make them real:
- `Dashboard.js`: Add a neighborhood dropdown (calls `GET /api/neighborhoods`), then display a line chart of consumption over time (use Recharts or Chart.js)
- `Compare.js`: Two neighborhood dropdowns, overlay their data on the same chart
- `Upload.js`: Already works — maybe add a table showing recent uploads
- Styling: Make it look presentable (the CSS is minimal right now)
- Install chart library: `cd frontend && npm install recharts`

**Person 5 — Integration & DevOps (Davos):**
You built the scaffold. Your job now is to keep the team unblocked:
- Make sure `docker compose up` works cleanly and document any issues
- Set up database migrations: `flask db init && flask db migrate -m "initial" && flask db upgrade` (run inside the backend container)
- Set up CI on Bitbucket Pipelines (run tests automatically on every push)
- Help teammates when their code doesn't connect properly
- Review PRs to make sure the architecture stays clean
- If time allows: set up AWS S3 integration for file storage (Sprint 3)

---

## Git Workflow

Everyone should follow this process:

1. **Pull latest main:** `git checkout main && git pull`
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make small commits** with clear messages as you work
4. **Push your branch:** `git push -u origin feature/your-feature-name`
5. **Open a Pull Request** on Bitbucket to merge into `main`
6. **Get at least one teammate to review** before merging

Branch naming examples:
- `feature/upload-validation` (Person 1)
- `feature/analytics-trends` (Person 2)
- `feature/sample-datasets` (Person 3)
- `feature/dashboard-charts` (Person 4)
- `feature/ci-pipeline` (Person 5)

---

## Quick Reference

| What | Command |
|------|---------|
| Run everything | `docker compose up --build` |
| Run backend only | `cd backend && ./venv/bin/flask run` |
| Run frontend only | `cd frontend && npm start` |
| Run tests | `cd backend && ./venv/bin/python -m pytest tests/ -v` |
| Check API health | `curl http://localhost:5000/api/health` |
| View the app | http://localhost:3000 |
