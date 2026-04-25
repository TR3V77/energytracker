# PROJ-117 Unit Test Plan (Backend)

## Scope
This plan selects three existing backend unit/integration test files as the
assignment test set, aligned to feature areas I contributed to:

- `backend/tests/test_dashboard_api.py`
- `backend/tests/test_recommendations_service.py`
- `backend/tests/test_trends.py`

## Test Selection Rationale
- `test_dashboard_api.py`: validates dashboard endpoint inputs and response
  behavior (valid/invalid query combinations and structure checks).
- `test_recommendations_service.py`: validates recommendation generation logic,
  including trigger outcomes, deterministic behavior, multi-neighborhood
  handling, and impact formatting.
- `test_trends.py`: validates monthly trends endpoint behavior, including
  aggregation output, pct-change computation, neighborhood filtering, and
  empty-result handling.

## Planned Execution
Run targeted pytest commands for each selected file:

1. `pytest backend/tests/test_dashboard_api.py`
2. `pytest backend/tests/test_recommendations_service.py`
3. `pytest backend/tests/test_trends.py`

## Expected Outcomes
- All selected tests execute without framework mismatch issues.
- Assertions verify endpoint/service behavior for dashboard, recommendations,
  and trends features.
- Results are captured and attached in the execution evidence task (PROJ-118).

## Risks / Notes
- Local environment must have pytest available and backend test dependencies
  installed.
- One dashboard granularity test is already intentionally skipped in SQLite due
  to PostgreSQL-specific behavior (`date_trunc`).
