from datetime import date

from app.extensions import db as _db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def test_rankings_use_leaderboard_contract_fields(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200

    payload = response.get_json()
    assert "generatedAt" in payload
    assert "window" in payload
    assert "rows" in payload
    assert payload["rows"]
    first = payload["rows"][0]
    assert "rank" in first
    assert "neighborhood" in first
    assert "efficiencyScore" in first
    assert "households" in first
    assert "totalKwh" in first
    assert "warnings" in payload
    assert "neighborhood_name" not in first
    assert "efficiency" not in first
    assert "rankings" not in payload


def test_rankings_assign_sequential_rank_values(client, app):
    with app.app_context():
        _db.session.add(
            Neighborhood(
                neighborhood_id=2,
                neighborhood_name="Second",
                households=10,
            )
        )
        _db.session.add(
            EnergyRecord(
                neighborhood_id=2,
                date=date(2026, 1, 15),
                total_kwh=150.0,
            )
        )
        _db.session.commit()

    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200
    rows = response.get_json()["rows"]
    assert [entry["rank"] for entry in rows] == list(range(1, len(rows) + 1))


def test_rankings_exclude_zero_households_not_in_rows(client, app):
    with app.app_context():
        _db.session.add(
            Neighborhood(
                neighborhood_id=3,
                neighborhood_name="ZeroHouseholds",
                households=0,
            )
        )
        _db.session.add(
            EnergyRecord(
                neighborhood_id=3,
                date=date(2026, 1, 15),
                total_kwh=999.0,
            )
        )
        _db.session.commit()

    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200

    payload = response.get_json()
    names = [row["neighborhood"] for row in payload["rows"]]
    assert "ZeroHouseholds" not in names
    assert payload["warnings"] == [
        {
            "neighborhood_id": 3,
            "neighborhood_name": "ZeroHouseholds",
            "reason": "excluded due to non-positive households",
        }
    ]
