from datetime import date

from app.extensions import db as _db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def test_rankings_use_frontend_contract_fields(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200

    payload = response.get_json()
    assert "rankings" in payload
    assert payload["rankings"]
    first = payload["rankings"][0]
    assert "neighborhood_name" in first
    assert "efficiency" in first
    assert "households" in first
    assert "total_kwh" in first
    assert "efficiency_score" not in first
    assert "name" not in first
    assert "score" not in first
    assert "warnings" in payload


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
    rankings = response.get_json()["rankings"]
    assert [entry["rank"] for entry in rankings] == list(
        range(1, len(rankings) + 1)
    )


def test_rankings_exclude_zero_households_with_warning(client, app):
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
    names = [row["neighborhood_name"] for row in payload["rankings"]]
    assert "ZeroHouseholds" not in names
    assert payload["warnings"] == [
        {
            "neighborhood_id": 3,
            "neighborhood_name": "ZeroHouseholds",
            "reason": "excluded due to non-positive households",
        }
    ]
