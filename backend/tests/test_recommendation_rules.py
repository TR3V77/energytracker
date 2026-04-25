"""Unit tests for app.services.recommendation_rules.evaluate_recommendation_rules.

Covers PROJ-100 trigger conditions: high_summer_peak, high_usage_variance,
and recommendation-id deduplication across overlapping triggers.
"""

from app.services.recommendation_rules import evaluate_recommendation_rules


def _condition_ids(result):
    return [c["id"] for c in result["triggered_conditions"]]


def _condition_by_id(result, condition_id):
    for condition in result["triggered_conditions"]:
        if condition["id"] == condition_id:
            return condition
    return None


def _recommendation_ids(result):
    return [r["id"] for r in result["recommendations"]]


def test_high_summer_peak_triggers_hvac_tuneup_and_smart_thermostat():
    metrics = {
        "neighborhood_id": 7,
        "neighborhood": "Sunridge",
        "households": 100,
        "total_kwh": 10_000.0,
        "efficiency_score": 200.0,
        "peak_kwh": 500.0,
    }

    result = evaluate_recommendation_rules(metrics, threshold=400.0)

    assert result["neighborhood_id"] == 7
    assert result["neighborhood"] == "Sunridge"
    assert result["score"] == 200.0

    assert "high_summer_peak" in _condition_ids(result)

    peak_condition = _condition_by_id(result, "high_summer_peak")
    assert peak_condition["name"] == "High Peak Usage"
    assert peak_condition["severity"] == "medium"
    assert "peak usage" in peak_condition["message"].lower()

    rec_ids = _recommendation_ids(result)
    assert "hvac_tuneup" in rec_ids
    assert "smart_thermostat" in rec_ids

    for recommendation in result["recommendations"]:
        assert set(recommendation.keys()) >= {
            "id",
            "action",
            "priority",
            "reason",
            "estimated_impact_pct",
        }
        assert recommendation["estimated_impact_pct"] == round(
            float(recommendation["estimated_impact_pct"]), 1
        )


def test_high_usage_variance_triggers_audit_and_thermostat():
    metrics = {
        "neighborhood_id": 12,
        "neighborhood": "Greenbrook",
        "households": 50,
        "total_kwh": 5_000.0,
        "efficiency_score": 200.0,
        "kwh_variance": 250.0,
    }

    result = evaluate_recommendation_rules(metrics, threshold=400.0)

    assert result["neighborhood_id"] == 12
    assert result["neighborhood"] == "Greenbrook"
    assert result["score"] == 200.0

    variance_condition = _condition_by_id(result, "high_usage_variance")
    assert variance_condition is not None
    assert variance_condition["name"] == "High Usage Variance"
    assert variance_condition["severity"] == "medium"
    assert "variance" in variance_condition["message"].lower()

    rec_ids = _recommendation_ids(result)
    assert "energy_audit" in rec_ids
    assert "smart_thermostat" in rec_ids


def test_low_rebate_high_usage_deduplicates_weatherization():
    metrics = {
        "neighborhood_id": 21,
        "neighborhood": "Oakcrest",
        "households": 1_000,
        "total_kwh": 100.0,
        "efficiency_score": 450.0,
        "rebate_participation_pct": 0.10,
    }

    result = evaluate_recommendation_rules(metrics, threshold=400.0)

    condition_ids = _condition_ids(result)
    assert "high_consumption" in condition_ids
    assert "low_rebate_high_usage" in condition_ids

    rec_ids = _recommendation_ids(result)

    assert rec_ids.count("weatherization_assistance") == 1
    assert "rebate_outreach" in rec_ids
    assert "efficiency_upgrade" in rec_ids
    assert "hvac_upgrades" in rec_ids

    assert len(rec_ids) == len(set(rec_ids))
