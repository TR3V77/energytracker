import pytest

from app.services.recommendations_service import get_recommendations


@pytest.fixture
def mock_metrics(monkeypatch):
    """
    Allows us to fake the metrics returned from get_efficiency_metrics
    so we can test deterministic rule behavior.
    """
    def _mock(data):
        monkeypatch.setattr(
            "app.services.recommendations_service.get_efficiency_metrics",
            lambda **kwargs: data
        )
    return _mock


def test_low_priority_recommendation(mock_metrics):
    mock_metrics([
        {"neighborhood": "TestVille", "efficiency_score": 300}
    ])

    results = get_recommendations(threshold=400)

    assert len(results) == 1
    assert results[0]["priority"] == "low"
    assert results[0]["action"] == "Community Recognition"
    assert results[0]["neighborhood"] == "TestVille"


def test_medium_priority_returns_two_recommendations(mock_metrics):
    mock_metrics([
        {"neighborhood": "MidTown", "efficiency_score": 360}
    ])

    results = get_recommendations(threshold=400)

    assert len(results) == 2

    for r in results:
        assert r["priority"] == "medium"

    actions = {r["action"] for r in results}

    assert "Schedule Energy Audit" in actions
    assert "Insulation Improvements" in actions


def test_high_priority_returns_three_recommendations(mock_metrics):
    mock_metrics([
        {"neighborhood": "HighCity", "efficiency_score": 500}
    ])

    results = get_recommendations(threshold=400)

    assert len(results) == 3

    for r in results:
        assert r["priority"] == "high"

    actions = {r["action"] for r in results}

    assert "Efficiency Upgrade" in actions
    assert "HVAC Upgrades" in actions
    assert "Weatherization Assistance" in actions


def test_recommendation_count_range(mock_metrics):
    mock_metrics([
        {"neighborhood": "Test", "efficiency_score": 500}
    ])

    results = get_recommendations(threshold=400)

    # high band must return 3
    assert 1 <= len(results) <= 3


def test_multiple_neighborhoods(mock_metrics):
    mock_metrics([
        {"neighborhood": "LowTown", "efficiency_score": 300},
        {"neighborhood": "MidTown", "efficiency_score": 360},
        {"neighborhood": "HighTown", "efficiency_score": 500},
    ])

    results = get_recommendations(threshold=400)

    # 1 + 2 + 3 = 6 total recommendations
    assert len(results) == 6


def test_actions_match_correct_trigger(mock_metrics):
    mock_metrics([
        {"neighborhood": "MidTown", "efficiency_score": 360}
    ])

    results = get_recommendations(threshold=400)

    actions = {r["action"] for r in results}

    # medium triggers only these two
    assert actions == {
        "Schedule Energy Audit",
        "Insulation Improvements"
    }