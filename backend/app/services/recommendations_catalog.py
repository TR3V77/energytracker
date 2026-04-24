from __future__ import annotations

from typing import Any


RECOMMENDATIONS_CATALOG: dict[str, dict[str, Any]] = {
    "community_recognition": {
        "id": "community_recognition",
        "action": "Community Recognition",
        "priority": "low",
        "reason": (
            "Neighborhood is operating below "
            "the efficient usage cutoff."
        ),
        "estimated_impact_pct": 0.0,
    },
    "demand_response_outreach": {
        "id": "demand_response_outreach",
        "action": "Demand Response Outreach",
        "priority": "medium",
        "reason": (
            "Encourage households to participate "
            "in peak-reduction programs."
        ),
        "estimated_impact_pct": 6.0,
    },
    "energy_audit": {
        "id": "energy_audit",
        "action": "Schedule Energy Audit",
        "priority": "medium",
        "reason": (
            "Consumption is above the efficient "
            "baseline and should be reviewed."
        ),
        "estimated_impact_pct": 8.0,
    },
    "insulation_improvements": {
        "id": "insulation_improvements",
        "action": "Insulation Improvements",
        "priority": "medium",
        "reason": (
            "Address likely building envelope "
            "losses that increase consumption."
        ),
        "estimated_impact_pct": 10.0,
    },
    "efficiency_upgrade": {
        "id": "efficiency_upgrade",
        "action": "Efficiency Upgrade",
        "priority": "high",
        "reason": (
            "Consumption is above "
            "the configured threshold."
        ),
        "estimated_impact_pct": 12.0,
    },
    "hvac_upgrades": {
        "id": "hvac_upgrades",
        "action": "HVAC Upgrades",
        "priority": "high",
        "reason": (
            "HVAC modernization can reduce "
            "sustained high household intensity."
        ),
        "estimated_impact_pct": 15.0,
    },
    "weatherization_assistance": {
        "id": "weatherization_assistance",
        "action": "Weatherization Assistance",
        "priority": "high",
        "reason": (
            "High usage suggests "
            "weatherization opportunities."
        ),
        "estimated_impact_pct": 9.0,
    },
    "hvac_tuneup": {
        "id": "hvac_tuneup",
        "action": "HVAC Tune-Up",
        "priority": "medium",
        "reason": "Peak usage suggests HVAC is running inefficiently during high-demand periods.",
        "estimated_impact_pct": 11.0,
    },
    "smart_thermostat": {
        "id": "smart_thermostat",
        "action": "Install Smart Thermostat",
        "priority": "medium",
        "reason": "Automate temperature schedules to reduce peak and variance in usage.",
        "estimated_impact_pct": 8.0,
    },
    "rebate_outreach": {
        "id": "rebate_outreach",
        "action": "Rebate Program Outreach",
        "priority": "medium",
        "reason": "High usage neighborhood has low rebate participation — significant savings available.",
        "estimated_impact_pct": 7.0,
    },
}


def get_catalog_recommendation(
    recommendation_id: str,
) -> dict[str, Any]:
    """Return one recommendation from the catalog by id."""
    recommendation = RECOMMENDATIONS_CATALOG.get(recommendation_id)
    if recommendation is None:
        raise KeyError(
            f"Unknown recommendation id: {recommendation_id}"
        )
    return recommendation.copy()
