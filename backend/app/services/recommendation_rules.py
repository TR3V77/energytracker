from __future__ import annotations

from typing import Any

from app.services.recommendation_mapping import (
    get_recommendation_ids_for_triggers,
)
from app.services.recommendations_catalog import get_catalog_recommendation


def _safe_divide(numerator: float, denominator: float) -> float:
    """Return numerator / denominator, protecting against division by zero."""
    if denominator == 0:
        return 0.0
    return numerator / denominator


def evaluate_recommendation_rules(
    metrics: dict[str, Any],
    threshold: float = 400.0,
) -> dict[str, Any]:
    """
    Deterministically evaluate one neighborhood metrics object and return:

    {
        "neighborhood_id": int,
        "neighborhood": str,
        "score": float,
        "triggered_conditions": [
            {
                "id": str,
                "name": str,
                "severity": "low" | "medium" | "high",
                "message": str,
            },
            ...
        ],
        "recommendations": [
            {
                "id": str,
                "action": str,
                "priority": "low" | "medium" | "high",
                "reason": str,
                "estimated_impact_pct": float,
            },
            ...
        ],
    }

    Rules are deterministic:
    - Same input metrics -> same outputs
    - Recommendation output is catalog-backed and deduplicated by id
    """

    neighborhood_id = int(metrics.get("neighborhood_id", 0))
    neighborhood = str(metrics.get("neighborhood", "Unknown"))
    households = int(metrics.get("households", 0) or 0)
    total_kwh = float(metrics.get("total_kwh", 0.0) or 0.0)
    efficiency_score = float(metrics.get("efficiency_score", 0.0) or 0.0)

    efficient_cutoff = threshold * 0.85
    high_cutoff = threshold
    very_high_cutoff = threshold * 1.20

    avg_kwh_per_household_total = _safe_divide(total_kwh, households)

    triggered_conditions: list[dict[str, Any]] = []
    triggered_ids: list[str] = []

    def add_condition(
        condition_id: str,
        name: str,
        severity: str,
        message: str,
    ) -> None:
        triggered_conditions.append(
            {
                "id": condition_id,
                "name": name,
                "severity": severity,
                "message": message,
            }
        )

    def add_trigger(trigger_id: str) -> None:
        triggered_ids.append(trigger_id)

    # Rule 1: strong performance
    if efficiency_score <= efficient_cutoff:
        add_condition(
            condition_id="efficient_usage",
            name="Efficient Usage",
            severity="low",
            message=(
                f"{neighborhood} is performing efficiently. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is at or below the efficient cutoff "
                f"({efficient_cutoff:.2f})."
            ),
        )
        add_trigger("efficient_usage")

    # Rule 2: moderate inefficiency
    if efficient_cutoff < efficiency_score < high_cutoff:
        add_condition(
            condition_id="moderate_inefficiency",
            name="Moderate Inefficiency",
            severity="medium",
            message=(
                f"{neighborhood} is above the efficient baseline. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is between {efficient_cutoff:.2f} "
                f"and {high_cutoff:.2f}."
            ),
        )
        add_trigger("moderate_inefficiency")

    # Rule 3: high inefficiency
    if efficiency_score >= high_cutoff:
        add_condition(
            condition_id="high_consumption",
            name="High Consumption",
            severity="high",
            message=(
                f"{neighborhood} exceeds the threshold. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is above {high_cutoff:.2f}."
            ),
        )
        add_trigger("high_consumption")

    # Rule 4: very high inefficiency
    if efficiency_score >= very_high_cutoff:
        add_condition(
            condition_id="critical_consumption",
            name="Critical Consumption",
            severity="high",
            message=(
                f"{neighborhood} is far above target usage. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"exceeds the critical cutoff ({very_high_cutoff:.2f})."
            ),
        )
        add_trigger("critical_consumption")

    # Rule 5: unusually high total usage for the population size
    if (households > 0
            and avg_kwh_per_household_total >= threshold * 1.10):
        add_condition(
            condition_id="high_per_household_load",
            name="High Per-Household Load",
            severity="high",
            message=(
                f"{neighborhood} has a high average household load "
                f"({avg_kwh_per_household_total:.2f} kWh/household)."
            ),
        )
        add_trigger("high_per_household_load")

    # Rule 6: high kWh/household vs city average
    city_avg_estimate = threshold * 0.75
    if efficiency_score > city_avg_estimate * 1.25:
        add_condition(
            condition_id="high_kwh_vs_city_avg",
            name="High Usage vs City Average",
            severity="medium",
            message=(
                f"{neighborhood} efficiency score "
                f"({efficiency_score:.2f} kWh/household) is more than 25% "
                f"above the estimated city average "
                f"({city_avg_estimate:.2f} kWh/household). "
                f"Insulation and HVAC improvements are recommended."
            ),
        )
        add_trigger("high_kwh_vs_city_avg")
    
    # Rule 7: high summer peak usage
    peak_kwh = float(metrics.get("peak_kwh") or 0.0)
    peak_proxy = peak_kwh if peak_kwh > 0 else _safe_divide(total_kwh, max(households, 1))
    if peak_proxy >= threshold * 1.15:
        add_condition(
            condition_id="high_summer_peak",
            name="High Peak Usage",
            severity="medium",
            message=(
                f"{neighborhood} shows high peak usage "
                f"({peak_proxy:.2f} kWh). "
                f"HVAC tune-up and smart thermostat installation recommended."
            ),
        )
        add_trigger("high_summer_peak")
    
    # Rule 8: high usage variance / spikes
    kwh_variance = float(metrics.get("kwh_variance") or 0.0)
    if kwh_variance >= threshold * 0.50:
        add_condition(
            condition_id="high_usage_variance",
            name="High Usage Variance",
            severity="medium",
            message=(
                f"{neighborhood} shows high variance in energy usage "
                f"(variance: {kwh_variance:.2f}). "
                f"An energy audit and smart thermostat are recommended."
            ),
        )
        add_trigger("high_usage_variance")

    # Rule 9: low rebate participation + high usage
    rebate_pct = float(metrics.get("rebate_participation_pct") or 0.0)
    if efficiency_score >= high_cutoff and rebate_pct < 0.20:
        add_condition(
            condition_id="low_rebate_high_usage",
            name="Low Rebate Participation + High Usage",
            severity="medium",
            message=(
                f"{neighborhood} has high energy usage but low rebate "
                f"participation ({rebate_pct:.0%}). "
                f"Rebate outreach and weatherization could reduce costs significantly."
            ),
        )
        add_trigger("low_rebate_high_usage")

    recommendation_ids = get_recommendation_ids_for_triggers(triggered_ids)
    recommendations = [
        {
            **get_catalog_recommendation(recommendation_id),
            "estimated_impact_pct": round(
                float(get_catalog_recommendation(recommendation_id)[
                    "estimated_impact_pct"
                ]),
                1,
            ),
        }
        for recommendation_id in recommendation_ids
    ]

    
    return {
        "neighborhood_id": neighborhood_id,
        "neighborhood": neighborhood,
        "score": round(efficiency_score, 2),
        "triggered_conditions": triggered_conditions,
        "recommendations": recommendations,
    }
