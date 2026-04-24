import json
import pytest
from datetime import date
 
from app.extensions import db as _db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def _get_rankings(client, **params):
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"/api/leaderboard/efficiency?{qs}" if qs else "/api/leaderboard/efficiency"
    response = client.get(url)
    assert response.status_code == 200
    return response.get_json()

REQUIRED_TOP_LEVEL = {"generatedAt", "window", "rows", "warnings"}
REQUIRED_ROW_FIELDS = {"rank", "neighborhood", "efficiencyScore",
                       "households", "totalKwh"}
    
def test_leaderboard_returned_fields_match_contract(client):
    """Every row must contain exactly the required leaderboard fields."""
    payload = _get_rankings(client)
 
    missing_top = REQUIRED_TOP_LEVEL - payload.keys()
    assert not missing_top, f"Missing top-level fields: {missing_top}"
    assert len(payload["rows"]) >= 1
 
    for entry in payload["rows"]:
        missing = REQUIRED_ROW_FIELDS - entry.keys()
        assert not missing, f"Missing fields in row: {missing}"

def test_leaderboard_field_types_are_correct(client):
    """Field types must match what the frontend expects."""
    payload = _get_rankings(client)
    entry = payload["rows"][0]
 
    assert isinstance(entry["rank"], int)
    assert isinstance(entry["neighborhood"], str)
    assert isinstance(entry["efficiencyScore"], float)
    assert isinstance(entry["households"], int)
    assert isinstance(entry["totalKwh"], float)

def test_total_kwh_aggregated_correctly_for_full_window(app, client):
    """totalKwh must equal the sum of all energy records for that neighborhood."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=10, neighborhood_name="AggTest", households=100
        ))
        _db.session.add_all([
            EnergyRecord(neighborhood_id=10, date=date(2025, 1, 1), total_kwh=200.0),
            EnergyRecord(neighborhood_id=10, date=date(2025, 1, 2), total_kwh=300.0),
            EnergyRecord(neighborhood_id=10, date=date(2025, 1, 3), total_kwh=500.0),
        ])
        _db.session.commit()
 
    payload = _get_rankings(client)
    entry = next(r for r in payload["rows"] if r["neighborhood"] == "AggTest")
 
    assert entry["totalKwh"] == 1000.0

def test_total_kwh_respects_date_window(app, client):
    """totalKwh must only sum records within the selected date window."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=11, neighborhood_name="WindowTest", households=100
        ))
        _db.session.add_all([
            EnergyRecord(neighborhood_id=11, date=date(2025, 1, 1), total_kwh=100.0),
            EnergyRecord(neighborhood_id=11, date=date(2025, 2, 1), total_kwh=200.0),
            EnergyRecord(neighborhood_id=11, date=date(2025, 3, 1), total_kwh=400.0),
        ])
        _db.session.commit()
 
    # Only Jan — should be 100.0
    payload = _get_rankings(
        client,
        date_from="2025-01-01",
        date_to="2025-01-31",
    )
    entry = next(
        (r for r in payload["rows"] if r["neighborhood"] == "WindowTest"),
        None,
    )
    assert entry is not None
    assert entry["totalKwh"] == 100.0

def test_efficiency_calculation_is_total_kwh_divided_by_households(app, client):
    """efficiencyScore must equal totalKwh / households."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=12, neighborhood_name="CalcTest", households=50
        ))
        _db.session.add(
            EnergyRecord(neighborhood_id=12, date=date(2025, 1, 1), total_kwh=750.0)
        )
        _db.session.commit()
 
    payload = _get_rankings(client)
    entry = next(r for r in payload["rows"] if r["neighborhood"] == "CalcTest")
 
    assert entry["efficiencyScore"] == 750.0 / 50

def test_efficiency_matches_manual_calculation_for_seeded_neighborhood(client):
    """Seed: 100 kWh / 10 households = 10.0."""
    payload = _get_rankings(client)
    entry = next(
        r for r in payload["rows"]
        if r["neighborhood"] == "Test Neighborhood"
    )
    assert entry["efficiencyScore"] == 10.0

def test_zero_household_neighborhoods_excluded(app, client):
    """Neighborhoods with 0 households must not appear in rankings."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=13, neighborhood_name="ZeroTest", households=0
        ))
        _db.session.add(
            EnergyRecord(neighborhood_id=13, date=date(2025, 1, 1), total_kwh=999.0)
        )
        _db.session.commit()
 
    payload = _get_rankings(client)
    names = [r["neighborhood"] for r in payload["rows"]]
    assert "ZeroTest" not in names
 

def test_api_response_is_valid_json_with_correct_top_level_keys(client):
    """Response must be valid JSON with correct top-level keys."""
    response = client.get("/api/leaderboard/efficiency")
    assert response.status_code == 200
    assert response.content_type == "application/json"
 
    payload = response.get_json()
    assert "rows" in payload
    assert "warnings" in payload
    assert "generatedAt" in payload
    assert "window" in payload
    assert isinstance(payload["rows"], list)
    assert isinstance(payload["warnings"], list)

def test_rankings_are_ordered_ascending_by_efficiency(app, client):
    """rank 1 must have the lowest efficiency score — most efficient first."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=14, neighborhood_name="Expensive", households=10
        ))
        _db.session.add(
            EnergyRecord(neighborhood_id=14, date=date(2025, 1, 1), total_kwh=5000.0)
        )
        _db.session.commit()
 
    payload = _get_rankings(client)
    rankings = payload["rankings"]
 
    scores = [r["efficiency"] for r in rankings]
    assert scores == sorted(scores), "Rankings are not sorted by efficiency ASC"

def test_rankings_are_ordered_ascending_by_efficiency(app, client):
    """rank 1 must have the lowest efficiencyScore — most efficient first."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=14, neighborhood_name="Expensive", households=10
        ))
        _db.session.add(
            EnergyRecord(neighborhood_id=14, date=date(2025, 1, 1), total_kwh=5000.0)
        )
        _db.session.commit()
 
    payload = _get_rankings(client)
    scores = [r["efficiencyScore"] for r in payload["rows"]]
    assert scores == sorted(scores), "Rows are not sorted by efficiencyScore ASC"

def test_ranks_are_sequential_starting_at_one(app, client):
    """Ranks must be 1, 2, 3... with no gaps."""
    with app.app_context():
        _db.session.add(Neighborhood(
            neighborhood_id=15, neighborhood_name="RankTest", households=10
        ))
        _db.session.add(
            EnergyRecord(neighborhood_id=15, date=date(2025, 1, 1), total_kwh=100.0)
        )
        _db.session.commit()
 
    payload = _get_rankings(client)
    ranks = [r["rank"] for r in payload["rows"]]
 
    assert ranks[0] == 1
    assert ranks == list(range(1, len(ranks) + 1))

def test_response_structure_passes_cleanly_to_jsonify(client):
    """All values in the response must be JSON-serializable primitives."""
    response = client.get("/api/leaderboard/efficiency")
    payload = response.get_json()
 
    try:
        json.dumps(payload)
    except (TypeError, ValueError) as e:
        pytest.fail(f"Response is not cleanly JSON-serializable: {e}")