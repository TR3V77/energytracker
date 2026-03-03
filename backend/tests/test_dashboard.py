# backend/tests/test_dashboard.py

import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_dashboard_no_data(client):
    response = client.get("/api/dashboard")
    data = response.get_json()

    assert response.status_code == 200
    assert "hasData" in data

    if data["hasData"] is False:
        assert "message" in data


def test_dashboard_with_data_structure(client):
    response = client.get("/api/dashboard")
    data = response.get_json()

    assert response.status_code == 200

    if data["hasData"]:
        # KPI fields exist
        assert "kpis" in data
        assert "total_kwh" in data["kpis"]
        assert isinstance(data["kpis"]["total_kwh"], (int, float))

        # Timeseries exists
        assert "timeseries" in data
        assert isinstance(data["timeseries"], list)

        if len(data["timeseries"]) > 0:
            dates = [item["date"] for item in data["timeseries"]]
            assert dates == sorted(dates)
