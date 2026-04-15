"""PROJ-114: Verify month-over-month energy consumption trends."""

from datetime import date

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def _seed_monthly_data(app):
    """Seed 3 months of energy data across 2 neighborhoods."""
    with app.app_context():
        db.session.add(Neighborhood(
            neighborhood_id=2, neighborhood_name="Second", households=20
        ))

        records = [
            # Neighborhood 1 (from conftest: id=1, 10 households)
            EnergyRecord(neighborhood_id=1, date=date(2026, 1, 10), total_kwh=100.0),
            EnergyRecord(neighborhood_id=1, date=date(2026, 1, 20), total_kwh=100.0),
            EnergyRecord(neighborhood_id=1, date=date(2026, 2, 10), total_kwh=120.0),
            EnergyRecord(neighborhood_id=1, date=date(2026, 2, 20), total_kwh=100.0),
            EnergyRecord(neighborhood_id=1, date=date(2026, 3, 15), total_kwh=150.0),
            # Neighborhood 2
            EnergyRecord(neighborhood_id=2, date=date(2026, 1, 5), total_kwh=200.0),
            EnergyRecord(neighborhood_id=2, date=date(2026, 2, 5), total_kwh=250.0),
            EnergyRecord(neighborhood_id=2, date=date(2026, 3, 5), total_kwh=180.0),
        ]
        db.session.add_all(records)
        db.session.commit()


def test_trends_endpoint_returns_200(client):
    response = client.get("/api/analytics/trends")
    assert response.status_code == 200
    assert "trends" in response.get_json()


def test_trends_returns_monthly_aggregation(app, client):
    _seed_monthly_data(app)

    response = client.get("/api/analytics/trends")
    trends = response.get_json()["trends"]

    assert len(trends) >= 3
    periods = [t["period"] for t in trends]
    assert "2026-01" in periods
    assert "2026-02" in periods
    assert "2026-03" in periods


def test_trends_first_month_pct_change_is_null(app, client):
    _seed_monthly_data(app)

    response = client.get("/api/analytics/trends")
    trends = response.get_json()["trends"]

    first = next(t for t in trends if t["period"] == "2026-01")
    assert first["pct_change"] is None


def test_trends_pct_change_calculation(app, client):
    _seed_monthly_data(app)

    response = client.get("/api/analytics/trends")
    trends = response.get_json()["trends"]

    # Jan: 100+100+200 = 400 (seed conftest adds 100 for neighborhood 1 on 2026-01-15)
    # But conftest seed is neighborhood_id=1, date=2026-01-15, total_kwh=100
    # So Jan total: 100 (conftest) + 100 + 100 + 200 = 500
    # Feb total: 120 + 100 + 250 = 470
    # pct_change = ((470 - 500) / 500) * 100 = -6.0
    jan = next(t for t in trends if t["period"] == "2026-01")
    feb = next(t for t in trends if t["period"] == "2026-02")

    expected_pct = round(((feb["kwh"] - jan["kwh"]) / jan["kwh"]) * 100, 2)
    assert feb["pct_change"] == expected_pct


def test_trends_filter_by_neighborhood(app, client):
    _seed_monthly_data(app)

    response = client.get("/api/analytics/trends?neighborhood_id=2")
    trends = response.get_json()["trends"]

    # Neighborhood 2 only: Jan=200, Feb=250, Mar=180
    assert len(trends) == 3
    jan = next(t for t in trends if t["period"] == "2026-01")
    assert jan["kwh"] == 200.0

    feb = next(t for t in trends if t["period"] == "2026-02")
    assert feb["kwh"] == 250.0
    assert feb["pct_change"] == 25.0  # ((250-200)/200)*100

    mar = next(t for t in trends if t["period"] == "2026-03")
    assert mar["kwh"] == 180.0
    assert mar["pct_change"] == -28.0  # ((180-250)/250)*100


def test_trends_empty_when_no_data_for_neighborhood(client):
    response = client.get("/api/analytics/trends?neighborhood_id=999")
    trends = response.get_json()["trends"]
    assert trends == []
