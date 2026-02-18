# Session Notes — Davos De Hoyos

## What We Did This Session

### Assignments Completed
- **Assignment 4** (User Stories): Created 2 stories with 4 acceptance criteria each, 5 tasks per story, added to Jira and README
- **Assignment 5** (Task Board): Set up Sprint 1 board — milestone dates, estimates, statuses, branches
- **Assignment 6** (Standup): Prepared standup script, attended standup

### Stories I Created
**Story 1: View Upload Results with Row-Level Error Details** (PROJ-32)
- As a data administrator, I would like to see a detailed report after uploading a file showing valid records imported and specific row-level errors so that I can correct and re-upload invalid data.

**Story 2: Upload Energy Data in Multiple Formats** (PROJ-33)
- As an analyst, I would like to upload energy data in either CSV or JSON format so that I can import data from different sources and tools without manual conversion.

### My Tasks (10 hrs total)

**Story 1 tasks (PROJ-32):**
| PROJ ID | Task | Est. | Status |
|---------|------|------|--------|
| ??? | Design upload response schema with row-level error format | 1hr | NEED TO CREATE IN JIRA |
| PROJ-35 | Implement row-level validation in upload service | 1.5hr | Done |
| PROJ-36 | Store row-level errors in upload record | 1hr | Done |
| PROJ-37 | Build upload results display on frontend | 1hr | Done |
| PROJ-32 in-progress | Write unit tests for row-level validation and error reporting | 1hr | In Progress |

**Story 2 tasks (PROJ-33):**
| PROJ ID | Task | Est. | Status |
|---------|------|------|--------|
| PROJ-39 | Design JSON upload schema | 0.5hr | Done |
| PROJ-40 | Implement CSV file parser with field validation | 1hr | Done |
| PROJ-41 | Implement JSON file parser with field validation | 1hr | Done |
| PROJ-42 | Build file type selector in frontend upload form | 1hr | Done |
| PROJ-43 in-progress | Write unit tests for CSV and JSON parsing | 1.5hr | In Progress |

### Branches
- `feature/project-scaffolding` — all scaffold work (Done tasks linked via commits)
- `feature/PROJ-32-upload-validation-tests` — in progress testing task
- `feature/PROJ-43-csv-json-parsing-tests` — in progress testing task

### TODO Next Session
1. **Create missing task in Jira** — "Design upload response schema" under PROJ-32, 1hr, assign to me, Sprint 1, Done — then give Claude the PROJ ID to push a commit
2. **Move tasks back to Done** in Jira once branches show up in Development panel (give Jira a few minutes to sync)
3. **Finish in-progress tasks** — actually write the unit tests on the two test branches
4. **Set up CI pipeline** — Bitbucket Pipelines (bitbucket-pipelines.yml) — this could be another task to add

### Standup Script (for reference)
**What I did:**
"I built the project scaffold — Flask backend with app factory, three SQLAlchemy models, full REST API routes, CSV/JSON upload with row-level validation, Docker Compose, React frontend with routing, and 5 passing tests. 7.5 hours done."

**What I'm working on:**
"Unit tests for upload validation edge cases and CSV/JSON parsing. Both have branches pushed."

**Blockers:**
"No blockers. Scaffold PR is open for the team."

### Key Concepts (if professor asks)
- **App Factory** — `create_app()` lets you make different apps for dev/test/prod
- **Blueprints** — Flask's way to split routes into separate files
- **ORM** — SQLAlchemy maps Python classes to database tables
- **CORS** — allows React (port 3000) to call Flask (port 5000)
- **501 stubs** — endpoint exists with API contract defined, but logic not implemented yet
- **Composite index** — index on (neighborhood_id, date) for fast filtered queries
- **CI** — automated test runner on every push (Bitbucket Pipelines)

### Professor Standup Questions (process-oriented)
- "Why so much done already?" → Infrastructure had to come first so team isn't blocked
- "Why both in-progress are testing?" → Implementation had to exist before tests
- "How does your work connect to the team?" → Trevor builds on React skeleton, analytics person fills stubs, QA uses test fixtures
- "What if teammate isn't making progress?" → Reach out on Slack, pair if technical issue, redistribute if needed
- "What's your plan for rest of sprint?" → Finish tests, set up CI, review PRs, unblock teammates
