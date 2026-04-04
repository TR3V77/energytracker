import pytest

from app.services.recommendations_service import get_recommendations


@pytest.fixture
def mock_metrics(monkeypatch):
    def _mock(data):
        monkeypatch.setattr(
            "app.services.recommendations_service.get_efficiency_metrics",
            lambda **kwargs: data,
        )

    return _mock


def _flatten_by_neighborhood(result):
    rows = []
    for block in result:
        neighborhood = block["neighborhood"]
        for rec in block["recommendations"]:
            rows.append({**rec, "neighborhood": neighborhood})
    return rows


def _sample_metric(
    *,
    name: str,
    efficiency_score: float,
    neighborhood_id: int = 1,
    households: int = 10,
):
    total_kwh = float(efficiency_score * households)
    return {
        "neighborhood_id": neighborhood_id,
        "neighborhood": name,
        "households": households,
        "total_kwh": total_kwh,
        "efficiency_score": efficiency_score,
    }


def test_low_priority_recommendation(mock_metrics):
    mock_metrics([_sample_metric(name="TestVille", efficiency_score=300)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    assert len(results) == 1
    assert len(flat) == 1
    assert flat[0]["priority"] == "low"
    assert flat[0]["action"] == "Community Recognition"
    assert flat[0]["neighborhood"] == "TestVille"


def test_medium_priority_returns_two_recommendations(mock_metrics):
    mock_metrics([_sample_metric(name="MidTown", efficiency_score=360)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    assert len(results) == 1
    assert len(flat) == 2

    for r in flat:
        assert r["priority"] == "medium"

    actions = {r["action"] for r in flat}

    assert "Schedule Energy Audit" in actions
    assert "Insulation Improvements" in actions


def test_high_priority_recommendations(mock_metrics):
    mock_metrics([_sample_metric(name="HighCity", efficiency_score=500)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    assert len(results) == 1
    assert len(flat) >= 3

    actions = {r["action"] for r in flat}

    assert "Efficiency Upgrade" in actions
    assert "HVAC Upgrades" in actions
    assert "Weatherization Assistance" in actions


def test_recommendation_count_range(mock_metrics):
    mock_metrics([_sample_metric(name="Test", efficiency_score=500)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    assert 1 <= len(flat) <= 8


def test_multiple_neighborhoods(mock_metrics):
    mock_metrics(
        [
            _sample_metric(
                name="LowTown", efficiency_score=300, neighborhood_id=1
            ),
            _sample_metric(
                name="MidTown", efficiency_score=360, neighborhood_id=2
            ),
            _sample_metric(
                name="HighTown", efficiency_score=500, neighborhood_id=3
            ),
        ]
    )

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    assert len(results) == 3
    high_count = len(_flatten_by_neighborhood([results[2]]))
    assert len(flat) == 1 + 2 + high_count


def test_actions_match_correct_trigger(mock_metrics):
    mock_metrics([_sample_metric(name="MidTown", efficiency_score=360)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    actions = {r["action"] for r in flat}

    assert actions == {
        "Schedule Energy Audit",
        "Insulation Improvements",
    }
