# PROJ-117 Unit Test Plan (Backend) - Daniel Delgado

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


# PROJ-119 Unit Test Plan (Backend) - Trevor Strother

## Scope
This plan selects three existing backend unit/integration tests as the
assignment test set, targeting the leaderboard efficiency API:

- `tests/test_leaderboard_integration.py::test_leaderboard_returned_fields_match_contract`
- `tests/test_leaderboard_integration.py::test_total_kwh_aggregated_correctly_for_full_window`
- `tests/test_leaderboard_integration.py::test_efficiency_calculation_is_total_kwh_divided_by_households`

## Test Selection Rationale
- `test_leaderboard_returned_fields_match_contract`: validates that the API
  response includes all required top-level keys and that each row object
  contains the expected fields (`rank`, `neighborhood`, `efficiencyScore`,
  `households`, `totalKwh`).
- `test_total_kwh_aggregated_correctly_for_full_window`: validates that the
  `totalKwh` field correctly sums all `EnergyRecord` entries for a given
  neighborhood across the full date window.
- `test_efficiency_calculation_is_total_kwh_divided_by_households`: validates
  that `efficiencyScore` is correctly computed as `totalKwh / households` using
  the `Neighborhood` and `EnergyRecord` models.

## Planned Execution
Run targeted pytest command for the selected tests:

1. `python -m pytest tests/test_leaderboard.py::test_leaderboard_returned_fields_match_contract -v`
2. `python -m pytest tests/test_leaderboard.py::test_total_kwh_aggregated_correctly_for_full_window -v`
3. `python -m pytest tests/test_leaderboard.py::test_efficiency_calculation_is_total_kwh_divided_by_households -v`

## Expected Outcomes
- All three tests execute and pass without errors.
- Assertions verify API contract structure, DB aggregation logic, and
  efficiency score calculation for the leaderboard endpoint.
- Results are captured and attached in the execution evidence task ([TASK-ID+1]).

## Risks / Notes
- Local environment must have pytest installed and the Flask app configured
  with a test database.
- Tests seed the database directly, so a clean test DB state is required before
  each run.