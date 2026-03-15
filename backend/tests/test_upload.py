import io
import pytest

pytestmark = pytest.mark.skip(
    reason="Upload route disabled until uploads table exists in DB"
)


def test_upload_no_file(client):
    """Upload endpoint rejects requests without a file."""
    response = client.post('/api/upload')
    assert response.status_code == 400


def test_upload_invalid_type(client):
    """Upload endpoint rejects non-CSV/JSON files."""
    data = {'file': (io.BytesIO(b"hello"), 'test.txt')}
    response = client.post(
        '/api/upload', data=data,
        content_type='multipart/form-data'
    )
    assert response.status_code == 400


def test_upload_csv(client):
    """Upload endpoint accepts and processes a valid CSV."""
    csv_data = (
        "neighborhood,date,consumption_kwh\n"
        "Hyde Park,2024-01-15,45200.5\n"
    )
    data = {'file': (io.BytesIO(csv_data.encode()), 'test.csv')}
    response = client.post(
        '/api/upload', data=data,
        content_type='multipart/form-data'
    )
    assert response.status_code == 201
    result = response.get_json()
    assert result['record_count'] == 1
    assert result['status'] == 'completed'


def test_upload_json(client):
    """Upload endpoint accepts and processes valid JSON."""
    json_data = (
        '[{"neighborhood": "Mueller",'
        ' "date": "2024-01-15",'
        ' "consumption_kwh": 38100.0}]'
    )
    data = {'file': (io.BytesIO(json_data.encode()), 'test.json')}
    response = client.post(
        '/api/upload', data=data,
        content_type='multipart/form-data'
    )
    assert response.status_code == 201
    result = response.get_json()
    assert result['record_count'] == 1
