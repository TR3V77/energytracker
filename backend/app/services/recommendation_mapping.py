from __future__ import annotations

from app.services.recommendations_catalog import RECOMMENDATIONS_CATALOG

MIN_RECOMMENDATIONS_PER_TRIGGER = 2
MAX_RECOMMENDATIONS_PER_TRIGGER = 4


TRIGGER_TO_RECOMMENDATION_IDS: dict[str, list[str]] = {
    "efficient_usage": [
        "community_recognition",
        "demand_response_outreach",
    ],
    "moderate_inefficiency": [
        "energy_audit",
        "insulation_improvements",
    ],
    "high_consumption": [
        "efficiency_upgrade",
        "hvac_upgrades",
        "weatherization_assistance",
    ],
    "critical_consumption": [
        "hvac_upgrades",
        "insulation_improvements",
        "efficiency_upgrade",
    ],
    "high_per_household_load": [
        "demand_response_outreach",
        "energy_audit",
    ],
}


def validate_trigger_mapping() -> None:
    """Validate trigger mapping shape and catalog references."""
    for trigger_id, recommendation_ids in TRIGGER_TO_RECOMMENDATION_IDS.items():
        if not (
            MIN_RECOMMENDATIONS_PER_TRIGGER
            <= len(recommendation_ids)
            <= MAX_RECOMMENDATIONS_PER_TRIGGER
        ):
            raise ValueError(
                "Trigger "
                f"'{trigger_id}' must map to "
                f"{MIN_RECOMMENDATIONS_PER_TRIGGER}-"
                f"{MAX_RECOMMENDATIONS_PER_TRIGGER} recommendation IDs."
            )

        if len(recommendation_ids) != len(set(recommendation_ids)):
            raise ValueError(
                f"Trigger '{trigger_id}' has duplicate recommendation IDs."
            )

        unknown_ids = [
            rec_id
            for rec_id in recommendation_ids
            if rec_id not in RECOMMENDATIONS_CATALOG
        ]
        if unknown_ids:
            raise ValueError(
                f"Trigger '{trigger_id}' contains unknown recommendation IDs: "
                f"{unknown_ids}"
            )


def get_recommendation_ids_for_triggers(trigger_ids: list[str]) -> list[str]:
    """Resolve unique recommendation IDs in deterministic trigger order."""
    unique_ids: list[str] = []
    seen: set[str] = set()

    for trigger_id in trigger_ids:
        for recommendation_id in TRIGGER_TO_RECOMMENDATION_IDS.get(trigger_id, []):
            if recommendation_id in seen:
                continue
            seen.add(recommendation_id)
            unique_ids.append(recommendation_id)

    return unique_ids


validate_trigger_mapping()
