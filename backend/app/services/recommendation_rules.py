from __future__ import annotations

from typing import Any


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
    - Recommendation duplicates are removed by recommendation id
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
    deduped_recommendations: dict[str, dict[str, Any]] = {}

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

    def add_recommendation(
        recommendation_id: str,
        action: str,
        priority: str,
        reason: str,
        estimated_impact_pct: float,
    ) -> None:
        """
        Deduplicate by recommendation id.
        If the same recommendation is triggered by multiple rules,
        keep the highest-priority version.
        """
        priority_rank = {"low": 1, "medium": 2, "high": 3}

        candidate = {
            "id": recommendation_id,
            "action": action,
            "priority": priority,
            "reason": reason,
            "estimated_impact_pct": round(float(estimated_impact_pct), 1),
        }

        existing = deduped_recommendations.get(recommendation_id)
        if existing is None:
            deduped_recommendations[recommendation_id] = candidate
            return

        if priority_rank[candidate["priority"]] > priority_rank[existing["priority"]]:
            deduped_recommendations[recommendation_id] = candidate

    # Rule 1: strong performance
    if efficiency_score <= efficient_cutoff:
        add_condition(
            condition_id="efficient_usage",
            name="Efficient Usage",
            severity="low",
            message=(
                f"{neighborhood} is performing efficiently. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is at or below the efficient cutoff ({efficient_cutoff:.2f})."
            ),
        )
        add_recommendation(
            recommendation_id="community_recognition",
            action="Community Recognition",
            priority="low",
            reason="Neighborhood is already operating below the efficient usage cutoff.",
            estimated_impact_pct=0.0,
        )

    # Rule 2: moderate inefficiency
    if efficient_cutoff < efficiency_score < high_cutoff:
        add_condition(
            condition_id="moderate_inefficiency",
            name="Moderate Inefficiency",
            severity="medium",
            message=(
                f"{neighborhood} is above the efficient baseline. "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is between {efficient_cutoff:.2f} and {high_cutoff:.2f}."
            ),
        )
        add_recommendation(
            recommendation_id="energy_audit",
            action="Schedule Energy Audit",
            priority="medium",
            reason="Consumption is above the efficient baseline and should be reviewed.",
            estimated_impact_pct=8.0,
        )
        add_recommendation(
            recommendation_id="insulation_improvements",
            action="Insulation Improvements",
            priority="medium",
            reason="Moderate inefficiency often points to building envelope losses.",
            estimated_impact_pct=10.0,
        )

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
        add_recommendation(
            recommendation_id="efficiency_upgrade",
            action="Efficiency Upgrade",
            priority="high",
            reason="Consumption is above the configured threshold.",
            estimated_impact_pct=12.0,
        )
        add_recommendation(
            recommendation_id="hvac_upgrades",
            action="HVAC Upgrades",
            priority="high",
            reason="HVAC improvements are common for high household energy intensity.",
            estimated_impact_pct=15.0,
        )
        add_recommendation(
            recommendation_id="weatherization_assistance",
            action="Weatherization Assistance",
            priority="high",
            reason="High usage suggests weatherization opportunities.",
            estimated_impact_pct=9.0,
        )

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
        add_recommendation(
            recommendation_id="hvac_upgrades",
            action="HVAC Upgrades",
            priority="high",
            reason="Critical overuse strengthens the case for HVAC modernization.",
            estimated_impact_pct=18.0,
        )
        add_recommendation(
            recommendation_id="insulation_improvements",
            action="Insulation Improvements",
            priority="high",
            reason="Critical overuse may also reflect major envelope inefficiencies.",
            estimated_impact_pct=14.0,
        )

    # Rule 5: unusually high total usage for the population size
    if households > 0 and avg_kwh_per_household_total >= threshold * 1.10:
        add_condition(
            condition_id="high_per_household_load",
            name="High Per-Household Load",
            severity="high",
            message=(
                f"{neighborhood} has a high average household load "
                f"({avg_kwh_per_household_total:.2f} kWh/household)."
            ),
        )
        add_recommendation(
            recommendation_id="demand_response_outreach",
            action="Demand Response Outreach",
            priority="medium",
            reason="High household load may benefit from peak-reduction participation.",
            estimated_impact_pct=6.0,
        )

    recommendations = sorted(
        deduped_recommendations.values(),
        key=lambda rec: (
            {"high": 0, "medium": 1, "low": 2}[rec["priority"]],
            rec["action"],
        ),
    )

    return {
        "neighborhood_id": neighborhood_id,
        "neighborhood": neighborhood,
        "score": round(efficiency_score, 2),
        "triggered_conditions": triggered_conditions,
        "recommendations": recommendations,
    }