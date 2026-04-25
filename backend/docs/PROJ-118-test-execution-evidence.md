# PROJ-118 Test Execution Evidence (Backend)

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
