# PROJ-55: Research Bitbucket Pipelines CI Configuration

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
