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

1. `python -m pytest tests/test_leaderboard_integration.py::test_leaderboard_returned_fields_match_contract -v`
2. `python -m pytest tests/test_leaderboard_integration.py::test_total_kwh_aggregated_correctly_for_full_window -v`
3. `python -m pytest tests/test_leaderboard_integration.py::test_efficiency_calculation_is_total_kwh_divided_by_households -v`

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


# PROJ-124 Unit Test Plan (Backend) - Davos De Hoyos

## Scope
This plan covers three new backend unit tests targeting the recommendation
trigger conditions added in PROJ-100. All three exercise the pure function
`evaluate_recommendation_rules` in
`backend/app/services/recommendation_rules.py` and its catalog/mapping
dependencies.

New test file:

- `backend/tests/test_recommendation_rules.py::test_high_summer_peak_triggers_hvac_tuneup_and_smart_thermostat`
- `backend/tests/test_recommendation_rules.py::test_high_usage_variance_triggers_audit_and_thermostat`
- `backend/tests/test_recommendation_rules.py::test_low_rebate_high_usage_deduplicates_weatherization`

## Test Selection Rationale
- `test_high_summer_peak_triggers_hvac_tuneup_and_smart_thermostat`: validates
  that `peak_kwh >= threshold * 1.15` triggers the `high_summer_peak`
  condition and produces the catalog-backed recommendations `hvac_tuneup`
  and `smart_thermostat`. Asserts the shape of `triggered_conditions[*]`
  (id, name, severity, message) and `recommendations[*]`
  (id, action, priority, reason, estimated_impact_pct).
- `test_high_usage_variance_triggers_audit_and_thermostat`: validates that
  `kwh_variance >= threshold * 0.50` triggers the `high_usage_variance`
  condition and produces the recommendations `energy_audit` and
  `smart_thermostat`. Confirms condition severity is `medium` and the
  return-object includes `neighborhood`, `neighborhood_id`, and `score`.
- `test_low_rebate_high_usage_deduplicates_weatherization`: validates that
  when both `high_consumption` and `low_rebate_high_usage` triggers fire
  (each maps to `weatherization_assistance` in the catalog), the resulting
  recommendation list contains `weatherization_assistance` exactly once
  while both trigger ids appear in `triggered_conditions`.

## Planned Execution
Run the new test module under pytest with verbose output, JUnit XML, and
HTML coverage:

1. `python -m pytest tests/test_recommendation_rules.py::test_high_summer_peak_triggers_hvac_tuneup_and_smart_thermostat -v`
2. `python -m pytest tests/test_recommendation_rules.py::test_high_usage_variance_triggers_audit_and_thermostat -v`
3. `python -m pytest tests/test_recommendation_rules.py::test_low_rebate_high_usage_deduplicates_weatherization -v`

## Expected Outcomes
- All three tests execute and pass without errors.
- Assertions verify trigger evaluation, catalog-backed recommendation
  resolution, and deduplication of recommendation ids across overlapping
  triggers.
- Results, JUnit XML, and coverage HTML are captured and attached in the
  execution evidence task (PROJ-125).

## Risks / Notes
- Tests target a pure function (no DB seeding required), so they are
  hermetic and deterministic.
- Threshold defaults to 400.0; tests pass explicit metric values aligned
  to that threshold so future threshold changes will require revisiting
  the fixtures.