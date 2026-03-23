from __future__ import annotations

from typing import Any, Optional

from app.services.efficiency_metrics_service import (
    get_efficiency_metrics,
)

"""
Service-layer logic for the recommendations endpoint.

This module should control data access and apply recommendation rules.
Keep Flask request/response concerns in the route layer, and keep pure rule
logic in a separate module if/when it grows.
"""


def get_recommendations(
    threshold: float = 400.0,
    window: str = "30d",
    neighborhood_id: Optional[int] = None,
) -> list[dict[str, Any]]:
    """
    Return rule-based recommendations.

    Response item shape (aligned to frontend):
        {
            "neighborhood": str,
            "score": float,  # efficiency score in kWh/household
            "message": str,  # brief reasoning/explanation
            "action": str,
            "priority": "low" | "medium" | "high",
        }
    """

    metrics = get_efficiency_metrics(
        window=window,
        neighborhood_id=neighborhood_id,
    )

    # Rule thresholds:
    # - low/efficient: efficiency_score <= threshold * 0.85
    # - medium: between efficient band and threshold
    # - high: efficiency_score > threshold
    efficiency_cutoff = threshold * 0.85

    recommendations: list[dict[str, Any]] = []
    for metric in metrics:
        neighborhood_name = metric["neighborhood"]
        efficiency_score = float(metric["efficiency_score"])

        if efficiency_score <= efficiency_cutoff:
            priority = "low"
            action = "Community Recognition"
            message = (
                f"{neighborhood_name} is performing well! "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is at or below the cutoff ({efficiency_cutoff:.2f}) "
                "over the selected window."
            )
            recommendations.append(
                {
                    "neighborhood": neighborhood_name,
                    "score": efficiency_score,
                    "message": message,
                    "action": action,
                    "priority": priority,
                }
            )
        elif efficiency_score < threshold:
            # Triggered medium band: 2 recommendations
            priority = "medium"
            recommendations.extend(
                [
                    {
                        "neighborhood": neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            f"{neighborhood_name} uses more energy "
                            "than the efficient baseline. "
                            f"Efficiency score ({efficiency_score:.2f} "
                            "kWh/household) is between "
                            f"{efficiency_cutoff:.2f} and {threshold:.2f} "
                            "over the selected window."
                        ),
                        "action": "Schedule Energy Audit",
                        "priority": priority,
                    },
                    {
                        "neighborhood": neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            "Target efficiency improvements for "
                            f"{neighborhood_name}. "
                            "Suggested first step: insulation improvements "
                            "to reduce heating/cooling losses. "
                            f"(Efficiency: {efficiency_score:.2f} "
                            "kWh/household.)"
                        ),
                        "action": "Insulation Improvements",
                        "priority": priority,
                    },
                ]
            )
        else:
            # Triggered high band: 3 recommendations
            priority = "high"
            recommendations.extend(
                [
                    {
                        "neighborhood": neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            f"High consumption detected in "
                            f"{neighborhood_name}. "
                            f"Efficiency score ({efficiency_score:.2f} "
                            "kWh/household) exceeds the threshold. "
                            f"Threshold: {threshold:.2f} over the selected "
                            "window."
                        ),
                        "action": "Efficiency Upgrade",
                        "priority": priority,
                    },
                    {
                        "neighborhood": neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            "Recommend HVAC upgrades and better climate "
                            f"control for {neighborhood_name}. "
                            f"(Efficiency: {efficiency_score:.2f} "
                            "kWh/household.)"
                        ),
                        "action": "HVAC Upgrades",
                        "priority": priority,
                    },
                    {
                        "neighborhood": neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            "Consider weatherization assistance for "
                            f"{neighborhood_name} to reduce overall "
                            "loads. "
                            f"(Efficiency: {efficiency_score:.2f} "
                            "kWh/household.)"
                        ),
                        "action": "Weatherization Assistance",
                        "priority": priority,
                    },
                ]
            )

    return recommendations
