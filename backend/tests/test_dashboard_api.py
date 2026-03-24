import pytest


def test_dashboard_endpoint(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 200


def test_valid_window(client):
    response = client.get("/api/dashboard?window=30d")
    assert response.status_code == 200


def test_invalid_window(client):
    response = client.get("/api/dashboard?window=invalid")
    assert response.status_code == 400


def test_valid_neighborhood(client):
    response = client.get("/api/dashboard?neighborhood_id=1")
    assert response.status_code == 200


def test_invalid_neighborhood(client):
    response = client.get("/api/dashboard?neighborhood_id=99999")
    assert response.status_code == 404


@pytest.mark.skip(reason="date_trunc requires PostgreSQL, not available in SQLite test DB")
def test_valid_granularity(client):
    response = client.get("/api/dashboard?granularity=week")
    assert response.status_code == 200


def test_invalid_granularity(client):
    response = client.get("/api/dashboard?granularity=month")
    assert response.status_code == 400


def test_response_structure(client):
    response = client.get("/api/dashboard")
    data = response.get_json()

    assert "has_data" in data
    assert "unit" in data
    assert "filters" in data