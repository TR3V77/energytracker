# PROJ-118 Test Execution Evidence (Backend) - Daniel Delgado

## Selected Test Files
- `backend/tests/test_dashboard_api.py`
- `backend/tests/test_recommendations_service.py`
- `backend/tests/test_trends.py`

## How Results Are Generated
Run from repo root:

`powershell -ExecutionPolicy Bypass -File backend/tests/run_proj118_tests.ps1`

This script writes output to `backend/tests/test_results/`:
- `proj118-results.xml` (always, via `--junitxml`)
- `proj118-results.html` (if `pytest-html` is installed)
- `proj118-results.pdf` (if `wkhtmltopdf` is installed and HTML exists)

## Execution Results
- Date: 2026-04-24
- Command: `powershell -ExecutionPolicy Bypass -File backend/tests/run_proj118_tests.ps1`
- Outcome: `20 passed, 1 skipped`
- Generated artifacts:
  - `backend/tests/test_results/proj118-results.xml`
  - `backend/tests/test_results/proj118-results.html`
- PDF status: not generated on this machine (requires `wkhtmltopdf`)

## Notes on PDF Support
- Yes, backend test results can be exported to PDF.
- PDF generation is optional and depends on local tooling.
- Current flow is: pytest -> HTML report -> PDF conversion.

## Bitbucket Evidence Checklist
- Commit this document and test runner script.
- Run the script and attach generated files from `test_results/`.
- Include pass/fail summary and execution timestamp in PR description.


# PROJ-121 Test Execution Evidence (Backend) - Trevor Strother

## Selected Tests
- `tests/test_leaderboard_integration.py::test_leaderboard_returned_fields_match_contract`
- `tests/test_leaderboard_integration.py::test_total_kwh_aggregated_correctly_for_full_window`
- `tests/test_leaderboard_integration.py::test_efficiency_calculation_is_total_kwh_divided_by_households`

## How Results Are Generated
Run from backend directory:

`python -m pytest tests/test_leaderboard_integration.py::test_leaderboard_returned_fields_match_contract tests/test_leaderboard_integration.py::test_total_kwh_aggregated_correctly_for_full_window tests/test_leaderboard_integration.py::test_efficiency_calculation_is_total_kwh_divided_by_households -v`

## Execution Results
- Date: 2026-04-24
- Outcome: `3 passed in 0.48s`
- Terminal output:
```
platform win32 -- Python 3.12.10, pytest-7.4.4, pluggy-1.6.0
collected 3 items

tests/test_leaderboard_integration.py::test_leaderboard_returned_fields_match_contract PASSED  [ 33%]
tests/test_leaderboard_integration.py::test_total_kwh_aggregated_correctly_for_full_window PASSED  [ 66%]
tests/test_leaderboard_integration.py::test_efficiency_calculation_is_total_kwh_divided_by_households PASSED  [100%]

3 passed in 0.48s
```

## Bitbucket Evidence Checklist
- Commit this document to the repo in the location designated by the team.
- Terminal output above serves as the pass/fail evidence.
- Include pass/fail summary and execution date in PR description.