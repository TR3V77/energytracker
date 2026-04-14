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
    rec_ids = [r["id"] for r in flat]

    assert len(results) == 1
    assert rec_ids == [
        "community_recognition",
        "demand_response_outreach",
    ]
    assert flat[0]["neighborhood"] == "TestVille"


def test_medium_priority_returns_two_recommendations(mock_metrics):
    mock_metrics([_sample_metric(name="MidTown", efficiency_score=360)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)
    rec_ids = [r["id"] for r in flat]

    assert len(results) == 1
    assert rec_ids == ["energy_audit", "insulation_improvements"]


def test_high_priority_recommendations(mock_metrics):
    mock_metrics([_sample_metric(name="HighCity", efficiency_score=500)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)
    rec_ids = [r["id"] for r in flat]

    assert len(results) == 1
    assert rec_ids == [
        "efficiency_upgrade",
        "hvac_upgrades",
        "weatherization_assistance",
        "insulation_improvements",
        "demand_response_outreach",
        "energy_audit",
    ]


def test_recommendations_are_deterministic(mock_metrics):
    mock_metrics([_sample_metric(name="Test", efficiency_score=500)])

    first = get_recommendations(threshold=400)
    second = get_recommendations(threshold=400)

    assert first == second


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
    assert len(flat) == 10


def test_actions_match_correct_trigger(mock_metrics):
    mock_metrics([_sample_metric(name="MidTown", efficiency_score=360)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)
    rec_ids = [r["id"] for r in flat]
    assert rec_ids == ["energy_audit", "insulation_improvements"]


def test_estimated_impact_is_consistently_rounded(mock_metrics):
    mock_metrics([_sample_metric(name="HighCity", efficiency_score=500)])

    results = get_recommendations(threshold=400)
    flat = _flatten_by_neighborhood(results)

    for recommendation in flat:
        rounded = round(float(recommendation["estimated_impact_pct"]), 1)
        assert recommendation["estimated_impact_pct"] == rounded
