# Energy Tracker Roadmap

## Team Roles

| Role | Member | Responsibility |
|------|--------|---------------|
| **Ingestion Pipeline** | TBD | CSV upload → validation → database storage; error handling; schema enforcement |
| **Analytics Engine** | TBD | Aggregation queries, trend calculations, efficiency scoring, recommendations logic |
| **Dataset & QA** | TBD | Sample data creation, metric definitions, testing, documentation |
| **Frontend** | TBD | Dashboard UI, charts, filters, upload interface, styling |
| **Integration & DevOps** | Davos | Docker setup, CI/CD, API contracts, deployment, unblocking teammates |

---

## Project Timeline Overview

```
Feb 10          Feb 16          Feb 27          Mar 9           Mar 20
  |               |               |               |               |
  |  PRE-SPRINT   |   SPRINT 1    |   SPRINT 2    |   SPRINT 3    |
  |  Scaffolding  |  Foundation   |   Dashboard   |    Polish     |
  |               |   & Data      |  & Analytics  |   & Deploy    |
  |               |               |               |               |
  v               v               v               v               v
  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ▲               ▲                                               ▲
  |               |                                               |
  WE ARE HERE     SPRINT 1 START                          FINAL DELIVERY
  (Feb 16)        (Feb 16)
```

---

## Overall Progress

```
Project Completion:  [████░░░░░░░░░░░░░░░░] 15%

Sprint 1:           [██████████████░░░░░░] 75%  ← Scaffold done, 2 tasks remaining
Sprint 2:           [░░░░░░░░░░░░░░░░░░░░]  0%  ← Starts after Sprint 1
Sprint 3:           [░░░░░░░░░░░░░░░░░░░░]  0%  ← Starts after Sprint 2
```

---

## Three Core Features

The product is one cohesive dashboard with three sections:

```
┌──────────────────────────────────────────────────────────────────┐
│                     ENERGY TRACKER DASHBOARD                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [ Neighborhood ▼ ]  [ Time Range ▼ ]  [ Energy Type ▼ ]        │
│                                                                  │
│  ┌─── OVERVIEW TAB ───────────────────────────────────────────┐  │
│  │                                                             │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐     │  │
│  │  │ Total    │  │ Efficiency   │  │ Trend             │     │  │
│  │  │ 45,200   │  │ 320 kWh/     │  │ ↓ 8.3% vs last   │     │  │
│  │  │ kWh      │  │ household    │  │   period          │     │  │
│  │  └──────────┘  └──────────────┘  └───────────────────┘     │  │
│  │                                                             │  │
│  │  ┌─── Line Chart: kWh over time ────────────────────┐      │  │
│  │  │         /\      /\                                │      │  │
│  │  │   /\  /    \  /    \    /\                        │      │  │
│  │  │  /  \/      \/      \/    \                       │      │  │
│  │  │ Jan   Feb   Mar   Apr   May                       │      │  │
│  │  └───────────────────────────────────────────────────┘      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── RANKINGS TAB ───────────────────────────────────────────┐  │
│  │                                                             │  │
│  │  Efficiency = total_kwh / num_households                    │  │
│  │  Lower score = more efficient                               │  │
│  │                                                             │  │
│  │  Rank │ Neighborhood  │ Score │ Trend                       │  │
│  │  ─────┼───────────────┼───────┼───────                      │  │
│  │   1   │ Mueller       │  285  │  ↓ improving                │  │
│  │   2   │ Hyde Park     │  320  │  → flat                     │  │
│  │   3   │ Downtown      │  450  │  ↑ worsening                │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── RECOMMENDATIONS TAB ────────────────────────────────────┐  │
│  │                                                             │  │
│  │  Triggered conditions → Suggested actions                   │  │
│  │                                                             │  │
│  │  ⚠ Downtown: Low efficiency (450 kWh/household)             │  │
│  │    → Promote insulation/weatherization programs              │  │
│  │    → HVAC tune-up outreach                                  │  │
│  │    → Est. impact: 5% reduction ≈ 2,260 kWh saved            │  │
│  │                                                             │  │
│  │  ⚠ East Riverside: Worsening trend (+12% vs last period)    │  │
│  │    → Investigate recent drivers (weather/occupancy)          │  │
│  │    → Run targeted energy audits                             │  │
│  │                                                             │  │
│  │  ✓ No recommendations for Mueller (efficient & stable)      │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── UPLOAD ─────────────────────────────────────────────────┐  │
│  │  [ Choose CSV file ]  [ Upload ]                            │  │
│  │  ✓ 150 valid rows imported | ✗ 3 invalid rows (view errors) │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Feature 1: Interactive Neighborhood Dashboard

**What it does:**
- Select a neighborhood (search/dropdown) and time range
- KPI cards: total kWh, kWh/household (efficiency), % change vs previous period
- Line chart: consumption over time
- Filter by energy type (electric, gas)

**Who uses it:** City planners, sustainability analysts, utility analysts

**User stories:**
- As a city planner, I want to view a neighborhood's energy trend over time so I can spot changes and plan interventions.
- As an analyst, I want quick KPIs so I don't have to manually calculate totals and percent change.
- As a city planner, I want to view interactive line charts of energy usage over time so I can monitor consumption trends across neighborhoods.
- As a sustainability analyst, I want to compare neighborhoods using bar charts and trend indicators so I can identify high-usage areas.

### Feature 2: Neighborhood Efficiency Rankings

**What it does:**
- Ranks neighborhoods by `kWh / num_households` (lower = more efficient)
- Top N lists: most efficient, least efficient
- Arrows showing improvement/worsening vs previous period

**Who uses it:** Same users, but for prioritization

**User stories:**
- As a sustainability analyst, I want a ranked list of least efficient neighborhoods so I know where to focus programs first.
- As a sustainability manager, I want to see neighborhoods ranked by efficiency score so I can identify high and low performing areas.

### Feature 3: Recommendations Engine

**What it does (rules-based, not AI):**
- Detects conditions using simple rules:
  - High usage → Top N by kWh
  - Worsening trend → % increase vs previous period
  - Low efficiency → high kWh/household
- Generates 2-4 recommendations tied to each condition:
  - Low efficiency → "promote insulation/weatherization," "HVAC tune-up programs"
  - Worsening trend → "investigate recent drivers, run targeted audits"
  - High usage → "prioritize retrofits, demand response outreach"
- Rough impact estimate: "A 5% reduction ≈ 0.05 x current kWh"
- If no triggers fire → "No recommendations for this selection"

**Who uses it:** Program managers who need next steps, not just charts

**User stories:**
- As a program manager, I want the system to suggest actions when a neighborhood is inefficient so I can propose interventions quickly.
- As a city planner, I want recommendations (e.g., insulation, HVAC tune-up) so I can take actionable next steps.

**Acceptance criteria (recommendations):**
- For each triggered condition, system displays 2-4 recommendations from a predefined set
- Recommendations are tied to the detected condition (not generic)
- UI shows recommendations in a dedicated panel on the dashboard
- If no triggers fire, UI clearly states "No recommendations for this selection"

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FLASK API (Backend)                        │
│                                                                │
│  /api/upload ████              /api/energy ████                │
│  /api/neighborhoods ████       /api/analytics/rankings ░░░░    │
│  /api/health ████              /api/analytics/trends ░░░░      │
│                                /api/analytics/recommendations ░░░░│
│                                                                │
│  ████ = Working    ░░░░ = Stub (API contract defined)         │
├────────────────────────────────────────────────────────────────┤
│                     POSTGRESQL DATABASE                        │
│                                                                │
│  neighborhoods ████  energy_records ████  uploads ████         │
├────────────────────────────────────────────────────────────────┤
│                     DOCKER (All services)                      │
│  PostgreSQL :5432 ████  Flask :5000 ████  React :3000 ████    │
└──────────────────────────────────────────────────────────────┘
```

---

## Sprint 1 (Feb 16 – Feb 27, 2026)

**Total: 50 hours (10 hours per team member)**

### Sprint 1 Timeline (Day by Day)

```
         Week 1                              Week 2
Mon 16   Tue 17   Wed 18   Thu 19   Fri 20   Mon 23   Tue 24   Wed 25   Thu 26   Fri 27
  |        |        |        |        |        |        |        |        |        |
  ├── Research & ──►├── Core Implementation ──►├── Testing & ──►├─ Wrap Up──►│
  │   Setup         │   (bulk of coding)       │   Integration  │  & Review  │
  │                 │                          │                │            │
  │ Davos:          │ All roles:               │ QA:            │ All:       │
  │ Finish CI +     │ Build your tasks         │ Run tests      │ PR reviews │
  │ migrations      │                          │ Fix bugs       │ Merge PRs  │
  │                 │ Research tasks            │                │            │
  │ All:            │ should be done            │ DevOps:        │            │
  │ Pick up first   │ by Wed 18                │ Verify Docker  │            │
  │ task            │                          │ works for all  │            │
  |        |        |        |        |        |        |        |        |        |
```

### Key Milestones

```
Feb 16 ──── Sprint Start
  │         - All tasks on Jira board (Todo or In Progress)
  │         - Each person has 1-2 tasks In Progress
  │         - Scaffold PR merged to main
  │
Feb 18 ──── Research Complete
  │         - All research/training tasks finished
  │         - Research docs in research/ folder
  │         - Everyone moves to implementation tasks
  │
Feb 21 ──── Midpoint Check
  │         - Each person should have ~5 hrs of work done
  │         - At least 2-3 tasks in Done column per person
  │         - Flag any blockers to Davos
  │
Feb 25 ──── Code Complete
  │         - All implementation tasks done
  │         - PRs open for review
  │         - QA running integration tests
  │
Feb 27 ──── Sprint End
            - All PRs merged
            - All tests passing
            - Docker setup verified by everyone
```

---

### Davos — Integration & DevOps (10 hrs)

```
Progress: [██████████████████░░░░░░░░░░░░] 75% (7.5 / 10 hrs)

  Done ████████████████████████████░░░░░░░░  7.5 hrs
  In Progress ░░░░░░░░░░                      2.5 hrs
```

| Jira Task ID | Task | Est. | Status | Branch | Notes |
|--------------|------|------|--------|--------|-------|
| ET-__ | Define data schema and SQLAlchemy models | 2hr | Done | `feature/project-scaffolding` | 3 tables: neighborhoods, energy_records, uploads |
| ET-__ | Set up Flask backend project structure | 2hr | Done | `feature/project-scaffolding` | App factory, health endpoint, test fixtures |
| ET-__ | Set up Docker dev environment | 1.5hr | Done | `feature/project-scaffolding` | docker-compose with PostgreSQL, Flask, React |
| ET-__ | Implement CSV/JSON upload endpoint | 2hr | Done | `feature/project-scaffolding` | Parses, validates, stores data; 5 tests passing |
| ET-__ | Set up database migrations | 1hr | In Progress | `feature/ET-__-db-migrations` | flask db init/migrate/upgrade in Docker |
| ET-__ | Set up Bitbucket Pipelines CI | 1.5hr | In Progress | `feature/ET-__-ci-pipeline` | Auto-run pytest on every push |

---

### TBD — Ingestion Pipeline (10 hrs)

```
Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  0% (0 / 10 hrs)

  Suggested order:
  1. Research (1.5hr) ──► 2. Duplicates (2.5hr) ──► 3. Date formats (2hr)
                                                          │
                         5. Tests (2hr) ◄── 4. Error reporting (2hr)
```

| Jira Task ID | Task | Est. | Status | Notes |
|--------------|------|------|--------|-------|
| ET-__ | Research: data validation patterns for CSV ingestion | 1.5hr | Todo | See `research/` folder for documentation |
| ET-__ | Add duplicate record detection to upload service | 2.5hr | Todo | Prevent re-importing the same data |
| ET-__ | Add flexible date format handling | 2hr | Todo | Support MM/DD/YYYY, YYYY-MM-DD, etc. |
| ET-__ | Improve upload error reporting with row-level detail | 2hr | Todo | Return specific row numbers and field errors |
| ET-__ | Write upload validation edge case tests | 2hr | Todo | Bad dates, negative values, empty files, huge files |

**Total: 10 hrs (research: 1.5 hrs = 15%)**

Files you'll work in:
- `backend/app/services/upload_service.py`
- `backend/app/utils/validators.py`
- `backend/app/routes/upload.py`
- `backend/tests/test_upload.py`

---

### TBD — Analytics Engine (10 hrs)

```
Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  0% (0 / 10 hrs)

  Suggested order:
  1. Research (1.5hr) ──► 2. Efficiency scoring (2hr) ──► 3. Trends (2hr)
                                                               │
                         5. Recommendations (2.5hr) ◄── 4. Rankings (2hr)
```

| Jira Task ID | Task | Est. | Status | Notes |
|--------------|------|------|--------|-------|
| ET-__ | Research: SQLAlchemy aggregation and window functions | 1.5hr | Todo | See `research/` folder for documentation |
| ET-__ | Implement kWh/household efficiency scoring | 2hr | Todo | Core metric used by rankings and recommendations |
| ET-__ | Implement month-over-month trend calculation | 2hr | Todo | % change between periods, up/down/flat indicators |
| ET-__ | Implement Top N efficiency rankings endpoint | 2hr | Todo | Most/least efficient neighborhoods with trend arrows |
| ET-__ | Implement rules-based recommendations engine | 2.5hr | Todo | Condition detection → canned recommendations + impact estimate |

**Total: 10 hrs (research: 1.5 hrs = 15%)**

Files you'll work in:
- `backend/app/services/analytics_service.py` (stubs already exist)
- `backend/app/routes/analytics.py` (stubs already exist)
- `backend/tests/` (new test files)

---

### TBD — Dataset & QA (10 hrs)

```
Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  0% (0 / 10 hrs)

  Suggested order:
  1. Research datasets (2hr) ──► 2. Create samples (2hr) ──► 3. Data dictionary (2hr)
                                                                    │
                          5. Endpoint tests (2hr) ◄── 4. Integration tests (2hr)
```

| Jira Task ID | Task | Est. | Status | Notes |
|--------------|------|------|--------|-------|
| ET-__ | Research: Austin Energy and Pecan Street datasets | 2hr | Todo | See `research/` folder for documentation |
| ET-__ | Create sample CSV datasets for testing | 2hr | Todo | Realistic data matching our schema; multiple neighborhoods |
| ET-__ | Document data dictionary and expected value ranges | 2hr | Todo | What's a normal kWh? What date ranges? |
| ET-__ | Write integration tests for upload → query flow | 2hr | Todo | Upload CSV, then verify neighborhoods and energy endpoints |
| ET-__ | Write tests for neighborhood and energy endpoints | 2hr | Todo | Filter by date range, by neighborhood, empty results |

**Total: 10 hrs (research: 2 hrs = 20%)**

Files you'll work in:
- New folder: `data/samples/` (CSV files)
- `docs/` (data dictionary)
- `backend/tests/` (new test files)

---

### TBD — Frontend (10 hrs)

```
Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  0% (0 / 10 hrs)

  Suggested order:
  1. Research Recharts (1.5hr) ──► 2. KPI cards + dropdown (2.5hr) ──► 3. Line chart (2.5hr)
                                                                            │
                                          5. Styling (1.5hr) ◄── 4. Filters (2hr)
```

| Jira Task ID | Task | Est. | Status | Notes |
|--------------|------|------|--------|-------|
| ET-__ | Research: Recharts library for React dashboards | 1.5hr | Todo | See `research/` folder for documentation |
| ET-__ | Build KPI cards and neighborhood dropdown | 2.5hr | Todo | Total kWh, efficiency, % change cards + selector |
| ET-__ | Build consumption over time line chart | 2.5hr | Todo | Recharts line chart on Dashboard Overview tab |
| ET-__ | Build time range and energy type filter UI | 2hr | Todo | Period picker + electric/gas toggle |
| ET-__ | Style dashboard layout with tabs | 1.5hr | Todo | Overview / Rankings / Recommendations tab structure |

**Total: 10 hrs (research: 1.5 hrs = 15%)**

Files you'll work in:
- `frontend/src/pages/Dashboard.js`
- `frontend/src/components/` (new: KPICards, RankingsTable, RecommendationsPanel)
- `frontend/src/App.css`

---

## Dependency Map (What Blocks What)

```
                    ┌──────────────────┐
                    │  SCAFFOLD (Done) │
                    │  Davos           │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              v              v              v
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ Ingestion  │  │ Analytics  │  │  Frontend  │
     │ Pipeline   │  │ Engine     │  │            │
     │            │  │            │  │            │
     │ Improves   │  │ Rankings   │  │ Dashboard  │
     │ upload     │  │ Trends     │  │ KPIs       │
     │ service    │  │ Recs       │  │ Charts     │
     └─────┬──────┘  └──────┬─────┘  └─────┬──────┘
           │                │               │
           │         ┌──────┘               │
           v         v                      v
     ┌──────────────────┐          ┌────────────────┐
     │   Dataset & QA   │          │  CI Pipeline   │
     │                  │          │  Davos         │
     │   Tests all      │          │                │
     │   of the above   │          │  Catches bugs  │
     └──────────────────┘          │  automatically │
                                   └────────────────┘
```

---

## Sprint Hours Summary

```
                    Done    In Progress    Todo    Total
                    ────    ───────────    ────    ─────
Davos (DevOps)    │ 7.5hr │   2.5hr    │  0hr  │ 10hr │  ████████████████████░░░░░ 75%
Ingestion         │  0hr  │   0hr      │ 10hr  │ 10hr │  ░░░░░░░░░░░░░░░░░░░░░░░░  0%
Analytics         │  0hr  │   0hr      │ 10hr  │ 10hr │  ░░░░░░░░░░░░░░░░░░░░░░░░  0%
Dataset & QA      │  0hr  │   0hr      │ 10hr  │ 10hr │  ░░░░░░░░░░░░░░░░░░░░░░░░  0%
Frontend          │  0hr  │   0hr      │ 10hr  │ 10hr │  ░░░░░░░░░░░░░░░░░░░░░░░░  0%
                    ────    ───────────    ────    ─────
TOTAL             │ 7.5hr │   2.5hr    │ 40hr  │ 50hr │
```

---

## Jira Setup Checklist

- [ ] Set Jira timezone to America/Chicago (Personal Settings)
- [ ] Set milestone: Feb 16 – Feb 27, 2026
- [ ] Create User Stories (Epics) for each feature area
- [ ] Create Tasks under each story with hour estimates in story points field
- [ ] Verify: no task estimate > 3 hours
- [ ] Verify: total hours = 50 (10 per team member)
- [ ] Each team member: move 1–2 tasks to In Progress
- [ ] Each In Progress task: create a branch named `feature/ET-XX-short-description`
- [ ] Davos Done tasks: link to `feature/project-scaffolding` branch

## Branch Naming Convention

```
feature/ET-<task-id>-<short-description>
```

Examples:
- `feature/ET-12-db-migrations`
- `feature/ET-15-upload-validation`
- `feature/ET-20-dashboard-charts`

---

## Research Task Documentation

Any research/training task requires a document in the `research/` folder with:
1. Title of research/training
2. Why you are doing it
3. What you expect to learn — identify specific code/modules affected
4. What you expect to do with it — specific classes/files you will write
5. What Jira task(s) depend on this research

---

## Dataset Options to Investigate
- **Austin Energy** open data (fits the Texas theme!) — [data.austintexas.gov](https://data.austintexas.gov) has energy usage datasets
- **US EIA** (Energy Information Administration) — state/city level consumption data
- **OpenEI** — open energy datasets
- **Pecan Street** (Austin-based!) — residential energy data from Austin neighborhoods

## Sprint 1 Deliverables
- Project scaffold PR: `feature/project-scaffolding` (ready for review)
- See `docs/team-guide.md` for full architecture overview and setup instructions

---

## Sprint 2 (Mar 2 – Mar 13) — Preview

```
  ┌─────────────────────────────────────────────────────┐
  │  Analytics endpoints (rankings, trends, recs)        │
  │  Dashboard KPI cards + line chart                    │
  │  Rankings table with trend arrows                    │
  │  Recommendations panel with condition triggers       │
  │  End-to-end testing                                  │
  └─────────────────────────────────────────────────────┘
```

## Sprint 3 (Mar 16 – Mar 27) — Preview

```
  ┌─────────────────────────────────────────────────────┐
  │  AWS S3 integration for file storage                 │
  │  Export/reporting (CSV summary download)              │
  │  Final UI polish and responsive design               │
  │  Demo preparation                                    │
  │  Documentation cleanup                               │
  └─────────────────────────────────────────────────────┘
```
