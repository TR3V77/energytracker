"""PROJ-91: Verify /api/analytics/rankings returns frontend-ready shape."""

from datetime import date

from app.extensions import db
from app.models.neighborhood import Neighborhood
from app.models.energy_record import EnergyRecord

REQUIRED_TOP = {"generatedAt", "window", "rows", "warnings"}
REQUIRED_ROW_FIELDS = {
    "rank",
    "neighborhood",
    "efficiencyScore",
    "households",
    "totalKwh",
}


def test_rankings_response_has_contract_fields(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200

    body = response.get_json()
    missing_top = REQUIRED_TOP - body.keys()
    assert not missing_top, f"Missing top-level fields: {missing_top}"

    rows = body["rows"]
    assert len(rows) >= 1

    for entry in rows:
        missing = REQUIRED_ROW_FIELDS - entry.keys()
        assert not missing, f"Missing row fields: {missing}"


def test_rankings_rank_starts_at_one(client):
    response = client.get("/api/analytics/rankings")
    rows = response.get_json()["rows"]

    assert rows[0]["rank"] == 1


def test_rankings_sorted_ascending_by_efficiency_score(app, client):
    """Lower score = more efficient = rank 1."""
    with app.app_context():
        n2 = Neighborhood(
            neighborhood_id=2,
            neighborhood_name="Expensive",
            households=5,
        )
        db.session.add(n2)
        db.session.add(EnergyRecord(
            neighborhood_id=2,
            date=date(2026, 1, 15),
            total_kwh=500.0,
        ))
        db.session.commit()

    response = client.get("/api/analytics/rankings")
    rows = response.get_json()["rows"]

    assert len(rows) == 2
    assert rows[0]["efficiencyScore"] <= rows[1]["efficiencyScore"]
    assert rows[0]["rank"] == 1
    assert rows[1]["rank"] == 2
    assert rows[0]["neighborhood"] == "Test Neighborhood"


def test_rankings_efficiency_score_calculation(client):
    response = client.get("/api/analytics/rankings")
    entry = response.get_json()["rows"][0]

    # Seed: 100 kWh / 10 households = 10.0
    assert entry["efficiencyScore"] == 10.0
