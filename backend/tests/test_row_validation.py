import io
import json
import pytest

pytestmark = pytest.mark.skip(
    reason="Upload route disabled until uploads table exists in DB"
)


def _upload_csv(client, csv_text):
    """Helper: upload a CSV string and return the response."""
    data = {'file': (io.BytesIO(csv_text.encode()), 'test.csv')}
    response = client.post(
        '/api/upload', data=data,
        content_type='multipart/form-data'
    )
    return response


def test_all_valid_rows_no_errors(client):
    """CSV with all valid rows produces no errors."""
    csv_data = (
        "neighborhood,date,consumption_kwh\n"
        "Hyde Park,2024-01-15,45200.5\n"
        "Mueller,2024-01-16,38100.0\n"
    )
    response = _upload_csv(client, csv_data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['record_count'] == 2
    assert result['invalid_row_count'] == 0
    assert result['status'] == 'completed'
    assert result['errors'] is None


def test_missing_required_field_reports_row(client):
    """CSV missing 'neighborhood' reports correct row."""
    csv_data = (
        "neighborhood,date,consumption_kwh\n"
        ",2024-01-15,45200.5\n"
    )
    response = _upload_csv(client, csv_data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['invalid_row_count'] == 1
    errors = json.loads(result['errors'])
    assert errors[0]['row'] == 1
    assert any('neighborhood' in e for e in errors[0]['errors'])


def test_negative_kwh_flagged(client):
    """CSV with negative consumption_kwh is flagged."""
    csv_data = (
        "neighborhood,date,consumption_kwh\n"
        "Hyde Park,2024-01-15,-50\n"
    )
    response = _upload_csv(client, csv_data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['invalid_row_count'] == 1
    assert result['record_count'] == 0
    errors = json.loads(result['errors'])
    assert errors[0]['row'] == 1
    assert any('negative' in e for e in errors[0]['errors'])


def test_mixed_valid_invalid_rows(client):
    """CSV with 2 valid and 1 invalid row stores valid rows."""
    csv_data = (
        "neighborhood,date,consumption_kwh\n"
        "Hyde Park,2024-01-15,45200.5\n"
        ",2024-01-16,38100.0\n"
        "Mueller,2024-01-17,22000.0\n"
    )
    response = _upload_csv(client, csv_data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['record_count'] == 2
    assert result['invalid_row_count'] == 1
    assert result['status'] == 'partial'


def test_empty_file(client):
    """CSV with headers only produces record_count=0."""
    csv_data = "neighborhood,date,consumption_kwh\n"
    response = _upload_csv(client, csv_data)
    assert response.status_code == 201
    result = response.get_json()
    assert result['record_count'] == 0
    assert result['status'] == 'completed'
