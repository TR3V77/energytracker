"""PROJ-91: Verify /api/analytics/rankings returns frontend-ready shape."""

from datetime import date

from app.extensions import db
from app.models.neighborhood import Neighborhood
from app.models.energy_record import EnergyRecord


REQUIRED_FIELDS = {"rank", "neighborhood_id", "neighborhood_name", "efficiency", "households", "total_kwh"}


def test_rankings_response_has_all_frontend_fields(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200

    body = response.get_json()
    assert "rankings" in body

    rankings = body["rankings"]
    assert len(rankings) >= 1

    for entry in rankings:
        missing = REQUIRED_FIELDS - entry.keys()
        assert not missing, f"Missing fields: {missing}"


def test_rankings_rank_starts_at_one(client):
    response = client.get("/api/analytics/rankings")
    rankings = response.get_json()["rankings"]

    assert rankings[0]["rank"] == 1


def test_rankings_sorted_ascending_by_efficiency(app, client):
    """Lower efficiency = more efficient = rank 1."""
    with app.app_context():
        n2 = Neighborhood(neighborhood_id=2, neighborhood_name="Expensive", households=5)
        db.session.add(n2)
        db.session.add(EnergyRecord(neighborhood_id=2, date=date(2026, 1, 15), total_kwh=500.0))
        db.session.commit()

    response = client.get("/api/analytics/rankings")
    rankings = response.get_json()["rankings"]

    assert len(rankings) == 2
    assert rankings[0]["efficiency"] <= rankings[1]["efficiency"]
    assert rankings[0]["rank"] == 1
    assert rankings[1]["rank"] == 2
    # Seed neighborhood (100kwh / 10 houses = 10.0) should rank first
    assert rankings[0]["neighborhood_name"] == "Test Neighborhood"


def test_rankings_efficiency_calculation(client):
    response = client.get("/api/analytics/rankings")
    entry = response.get_json()["rankings"][0]

    # Seed: 100 kWh / 10 households = 10.0
    assert entry["efficiency"] == 10.0
    assert entry["households"] == 10
    assert entry["total_kwh"] == 100.0
