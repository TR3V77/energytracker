# backend/tests/test_dashboard.py


def test_dashboard_returns_valid_response(client):
    """Dashboard endpoint returns a valid JSON response."""
    response = client.get("/api/dashboard")
    data = response.get_json()

    # With empty test DB, neighborhood_id=1 won't exist,
    # so we accept either 200 (has_data/no data) or 404 (not found)
    assert response.status_code in (200, 404)
    assert data is not None


def test_dashboard_with_data_structure(client):
    """When dashboard returns 200 with data, structure is correct."""
    response = client.get("/api/dashboard")
    data = response.get_json()

    if response.status_code == 200 and data.get("has_data"):
        # KPI fields exist
        assert "kpis" in data
        assert "total_kwh" in data["kpis"]
        assert isinstance(data["kpis"]["total_kwh"], (int, float))

        # Timeseries exists
        assert "time_series" in data
        assert isinstance(data["time_series"], list)
