# Energy Tracker Roadmap

## Sprint 1: Foundation & Data (Weeks 1-2) ~10hrs

| Task | Est. | Owner | Notes |
|------|-------|-------|-------|
| **Research & select dataset** | 2hr | TBD | Find a real energy consumption dataset (options below) |
| **Define data schema** | 1hr | TBD | What columns/fields do we actually need? |
| **Set up project structure** | 1.5hr | TBD | Create frontend (React) + backend (Python/Flask) scaffolding |
| **Set up Docker dev environment** | 1.5hr | TBD | Dockerfile + docker-compose so everyone can run locally |
| **Set up PostgreSQL + SQLAlchemy models** | 2hr | TBD | Database tables matching the data schema |
| **CSV/JSON upload endpoint** | 2hr | TBD | Basic API to ingest a dataset file |

### Dataset Options to Investigate
- **Austin Energy** open data (fits the Texas theme!) — [data.austintexas.gov](https://data.austintexas.gov) has energy usage datasets
- **US EIA** (Energy Information Administration) — state/city level consumption data
- **OpenEI** — open energy datasets
- **Pecan Street** (Austin-based!) — residential energy data from Austin neighborhoods

## Sprint 2: Core Dashboard (Weeks 3-4)

| Task | Est. | Owner | Notes |
|------|-------|-------|-------|
| **React frontend scaffold with routing** | 2hr | TBD | Set up pages: Home, Dashboard, Upload, Compare |
| **Neighborhood selector + dashboard view** | 2hr | TBD | Dropdown/search to pick a neighborhood |
| **Charts (consumption over time)** | 3hr | TBD | Use Chart.js or Recharts for line/bar charts |
| **Time range filtering** | 2hr | TBD | Weekly/monthly/quarterly date range picker |

## Sprint 3: Analysis & Polish (Weeks 5-6)

| Task | Est. | Owner | Notes |
|------|-------|-------|-------|
| **Neighborhood comparison view** | 2hr | TBD | Side-by-side or overlay charts for two neighborhoods |
| **Hotspot identification** | 2hr | TBD | "Top N neighborhoods" table for highest usage / worst trend |
| **Basic reporting / export** | 2hr | TBD | CSV summary export + screenshot-ready summary view |
| **AWS S3 integration** | 2hr | TBD | Store uploaded datasets in S3 |
| **Styling and final polish** | 2hr | TBD | Responsive design, consistent theme, error states |
