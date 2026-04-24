"""PROJ-90: Verify leaderboard reflects new uploads."""

from datetime import date

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def _get_rows(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200
    return response.get_json()["rows"]


def test_rankings_update_after_new_energy_records(app, client):
    """Rankings reflect newly inserted data."""
    rows_before = _get_rows(client)
    assert len(rows_before) == 1

    first_before = next(
        r for r in rows_before
        if r["neighborhood"] == "Test Neighborhood"
    )
    original_total_kwh = first_before["totalKwh"]

    with app.app_context():
        db.session.add(EnergyRecord(
            neighborhood_id=1,
            date=date(2026, 2, 1),
            total_kwh=200.0,
        ))
        db.session.add(EnergyRecord(
            neighborhood_id=1,
            date=date(2026, 2, 2),
            total_kwh=150.0,
        ))
        db.session.commit()

    rows_after = _get_rows(client)
    first_after = next(
        r for r in rows_after
        if r["neighborhood"] == "Test Neighborhood"
    )
    updated_efficiency = first_after["efficiencyScore"]
    updated_total_kwh = first_after["totalKwh"]

    # Seed: 100 + 200 + 150 = 450 kWh / 10 households = 45.0
    assert updated_efficiency == 45.0
    assert updated_total_kwh == original_total_kwh + 350.0


def test_new_neighborhood_appears_in_rankings(app, client):
    """New neighborhood with data shows up in rankings."""
    rows_before = _get_rows(client)
    names_before = {r["neighborhood"] for r in rows_before}

    with app.app_context():
        db.session.add(Neighborhood(
            neighborhood_id=99,
            neighborhood_name="New District",
            households=50,
        ))
        db.session.add(EnergyRecord(
            neighborhood_id=99,
            date=date(2026, 3, 1),
            total_kwh=500.0,
        ))
        db.session.commit()

    rows_after = _get_rows(client)
    names_after = {r["neighborhood"] for r in rows_after}

    assert "New District" not in names_before
    assert "New District" in names_after

    new_entry = next(
        r for r in rows_after
        if r["neighborhood"] == "New District"
    )
    assert new_entry["efficiencyScore"] == 10.0


def test_rankings_order_changes_with_new_data(app, client):
    """Adding data changes relative ranking order."""
    with app.app_context():
        db.session.add(Neighborhood(
            neighborhood_id=2,
            neighborhood_name="Efficient Town",
            households=100,
        ))
        db.session.add(EnergyRecord(
            neighborhood_id=2,
            date=date(2026, 1, 15),
            total_kwh=50.0,
        ))
        db.session.commit()

    rows = _get_rows(client)
    assert rows[0]["neighborhood"] == "Efficient Town"
    assert rows[1]["neighborhood"] == "Test Neighborhood"

    with app.app_context():
        db.session.add(EnergyRecord(
            neighborhood_id=2,
            date=date(2026, 2, 1),
            total_kwh=5000.0,
        ))
        db.session.commit()

    rows_after = _get_rows(client)
    assert rows_after[0]["neighborhood"] == "Test Neighborhood"
    assert rows_after[1]["neighborhood"] == "Efficient Town"
