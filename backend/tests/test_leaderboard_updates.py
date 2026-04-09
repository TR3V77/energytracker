"""PROJ-90: Verify leaderboard reflects new uploads — no caching, live DB queries."""

from datetime import date

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def _get_rankings(client):
    response = client.get("/api/analytics/rankings")
    assert response.status_code == 200
    return response.get_json()["rankings"]


def test_rankings_update_after_new_energy_records(app, client):
    """Rankings should reflect newly inserted data without any manual refresh."""
    rankings_before = _get_rankings(client)
    assert len(rankings_before) == 1

    original_kwh = rankings_before[0]["total_kwh"]

    # Simulate an upload — insert new energy records
    with app.app_context():
        db.session.add(EnergyRecord(neighborhood_id=1, date=date(2026, 2, 1), total_kwh=200.0))
        db.session.add(EnergyRecord(neighborhood_id=1, date=date(2026, 2, 2), total_kwh=150.0))
        db.session.commit()

    rankings_after = _get_rankings(client)
    updated_kwh = rankings_after[0]["total_kwh"]

    assert updated_kwh == original_kwh + 350.0
    assert updated_kwh > original_kwh


def test_new_neighborhood_appears_in_rankings(app, client):
    """A brand new neighborhood with energy data should show up in rankings."""
    rankings_before = _get_rankings(client)
    neighborhood_ids_before = {r["neighborhood_id"] for r in rankings_before}

    with app.app_context():
        db.session.add(Neighborhood(neighborhood_id=99, neighborhood_name="New District", households=50))
        db.session.add(EnergyRecord(neighborhood_id=99, date=date(2026, 3, 1), total_kwh=500.0))
        db.session.commit()

    rankings_after = _get_rankings(client)
    neighborhood_ids_after = {r["neighborhood_id"] for r in rankings_after}

    assert 99 not in neighborhood_ids_before
    assert 99 in neighborhood_ids_after

    new_entry = next(r for r in rankings_after if r["neighborhood_id"] == 99)
    assert new_entry["total_kwh"] == 500.0
    assert new_entry["efficiency"] == 10.0  # 500 / 50 households


def test_rankings_order_changes_with_new_data(app, client):
    """Adding data that changes relative efficiency should update ranking order."""
    with app.app_context():
        db.session.add(Neighborhood(neighborhood_id=2, neighborhood_name="Efficient Town", households=100))
        db.session.add(EnergyRecord(neighborhood_id=2, date=date(2026, 1, 15), total_kwh=50.0))
        db.session.commit()

    rankings = _get_rankings(client)
    # Efficient Town: 50/100 = 0.5, Test Neighborhood: 100/10 = 10.0
    assert rankings[0]["neighborhood_name"] == "Efficient Town"
    assert rankings[1]["neighborhood_name"] == "Test Neighborhood"

    # Now flood Efficient Town with high usage, making it less efficient
    with app.app_context():
        db.session.add(EnergyRecord(neighborhood_id=2, date=date(2026, 2, 1), total_kwh=5000.0))
        db.session.commit()

    rankings_after = _get_rankings(client)
    # Efficient Town: 5050/100 = 50.5, Test Neighborhood: 100/10 = 10.0
    assert rankings_after[0]["neighborhood_name"] == "Test Neighborhood"
    assert rankings_after[1]["neighborhood_name"] == "Efficient Town"
