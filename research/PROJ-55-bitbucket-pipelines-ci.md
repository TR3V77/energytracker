# PROJ-55: Research Bitbucket Pipelines CI Configuration

## Key Concepts Learned

### CI/CD (Continuous Integration / Continuous Delivery)
CI/CD is a practice where code changes are automatically built, tested, and validated every time someone pushes to the repository. **Continuous Integration (CI)** means every push triggers automated checks — linting, tests, builds — so broken code gets caught immediately instead of during manual review. **Continuous Delivery (CD)** extends this to automatically deploy code to production, but we're only using CI for now.

Without CI, the only way to know if code works is to pull it locally and run everything yourself. With CI, the pipeline does this automatically on every push and PR, so the team knows right away if something is broken.

### YAML (YAML Ain't Markup Language)
YAML is a configuration file format that uses indentation (like Python) instead of brackets or tags. Bitbucket Pipelines reads a `bitbucket-pipelines.yml` file in the repo root to know what to run. The structure is human-readable — you define steps, each with a name, a Docker image, and a list of shell commands to execute. Indentation matters: a misaligned line will break the entire config.

### Flake8
Flake8 is a Python linting tool. A **linter** checks your code for style issues and common mistakes without actually running it. Flake8 enforces PEP 8 (Python's official style guide) — things like line length limits, proper spacing, unused imports, and consistent formatting. We configured it with a `.flake8` file that sets our max line length to 79 characters and tells it to ignore the `venv` and `migrations` folders. Running flake8 in the pipeline means no code with style violations can be merged into main.

### pytest-cov (Test Coverage)
pytest-cov is a plugin for pytest that measures **code coverage** — what percentage of your code is actually executed by your tests. For example, if you have 100 lines of code and your tests only exercise 70 of them, your coverage is 70%. We set a `--cov-fail-under=70` threshold, meaning the pipeline will fail if coverage drops below 70%. This prevents merging code that has no tests. Our current coverage is 79%.

### Docker Images in Pipelines
Each pipeline step runs inside a Docker container — an isolated environment with specific tools pre-installed. We use `python:3.12-slim` for backend steps (has Python and pip) and `node:18` for the frontend step (has Node.js and npm). This means the pipeline runs in a clean, consistent environment every time regardless of what's on any developer's local machine.

### Pipeline Caching
Installing dependencies (`pip install`, `npm install`) takes time. Bitbucket Pipelines supports **caching** — it saves downloaded packages between runs so they don't need to be re-downloaded every time. We cache `pip` packages for Python steps and `node` packages for the frontend step, which speeds up pipeline runs significantly.

## Why
The team had no CI/CD pipeline in place. Before implementing one, I needed to understand how Bitbucket Pipelines works — specifically how to configure multi-step builds, run Python and Node tools in Docker containers, and set up pipeline triggers for pushes and pull requests.

## What I Expected to Learn
- Bitbucket Pipelines YAML syntax: steps, images, caching, and trigger configuration
- How to run pytest, flake8, and npm build inside pipeline Docker containers
- How to use different Docker images (python:3.12-slim, node:18) for backend vs frontend steps
- How to configure pytest-cov for coverage thresholds in a CI environment
- How pipeline status badges work with Bitbucket and shields.io

## Code and Modules Affected
- `bitbucket-pipelines.yml` — new pipeline configuration file
- `backend/.flake8` — new flake8 linting configuration
- `backend/requirements.txt` — added flake8 and pytest-cov dependencies
- `README.md` — added build status badge
- Multiple backend `.py` files — fixed lint violations to pass the new flake8 step

## What I Did With It
- Created a pipeline with three steps: backend linting (flake8), backend tests with 70% coverage threshold (pytest-cov), and frontend build verification (npm run build)
- Pipeline triggers on pushes to main and on PRs targeting main
- Fixed all 21 existing lint violations across the backend codebase
- Added a shields.io status badge to the README so the team can see build status at a glance

## Dependent Jira Tasks
- PROJ-48: Set Up Bitbucket Pipelines CI (parent story — all subtasks depended on this research)
