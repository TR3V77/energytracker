# test_dashboard.py

from app import app  # or however your app is imported
from fastapi.testclient import TestClient

client = TestClient(app)

def test_dashboard_with_data():
    response = client.get("/api/dashboard")
    data = response.json()

    assert response.status_code == 200
    assert data["hasData"] is True

    # Check KPI fields exist
    assert "totalConsumption" in data
    assert isinstance(data["totalConsumption"], (int, float))

    # Check timeseries exists
    assert "timeseries" in data
    assert len(data["timeseries"]) > 0

    # Check ordering by date
    dates = [item["date"] for item in data["timeseries"]]
    assert dates == sorted(dates)
def test_dashboard_no_data():
    response = client.get("/api/dashboard")
    data = response.json()

    # Simulate empty DB beforehand if needed

    assert response.status_code == 200
    assert data["hasData"] is False
    assert "message" in data
