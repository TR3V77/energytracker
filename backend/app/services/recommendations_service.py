from __future__ import annotations

from typing import Any, Optional

from sqlalchemy import select, func

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import VALID_WINDOWS, get_window_start_date

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

    normalized_window = window.strip().lower()
    if normalized_window not in VALID_WINDOWS:
        # Route layer can translate this to 400 for raising exceptions
        # for now we keep a simple "return empty" contract.
        return []

    energy_filters = []
    if neighborhood_id is not None:
        energy_filters.append(EnergyRecord.neighborhood_id == neighborhood_id)

    latest_date_stmt = select(func.max(EnergyRecord.date)).where(
        *energy_filters
    ) if energy_filters else select(func.max(EnergyRecord.date))

    latest_record_date = db.session.execute(latest_date_stmt).scalar_one()

    if latest_record_date is None:
        return []

    start_date = get_window_start_date(
        normalized_window, latest_record_date
    )
    if start_date is not None:
        energy_filters.append(EnergyRecord.date >= start_date)

    # Aggregate kWh per neighborhood, then compute kWh/household
    metrics_stmt = (
        select(
            Neighborhood.neighborhood_id,
            Neighborhood.neighborhood_name,
            Neighborhood.households,
            func.coalesce(
                func.sum(EnergyRecord.total_kwh), 0
            ).label("total_kwh"),
        )
        .select_from(Neighborhood)
        .join(
            EnergyRecord,
            EnergyRecord.neighborhood_id == Neighborhood.neighborhood_id,
        )
        .group_by(
            Neighborhood.neighborhood_id,
            Neighborhood.neighborhood_name,
            Neighborhood.households,
        )
    )
    if energy_filters:
        metrics_stmt = metrics_stmt.where(*energy_filters)

    rows = db.session.execute(metrics_stmt).all()

    # Rule thresholds:
    # - low/efficient: efficiency_score <= threshold * 0.85
    # - medium: between efficient band and threshold
    # - high: efficiency_score > threshold
    efficiency_cutoff = threshold * 0.85

    recommendations: list[dict[str, Any]] = []
    for row in rows:
        households = int(row.households or 0)
        if households <= 0:
            continue

        efficiency_score = float(row.total_kwh) / households

        if efficiency_score <= efficiency_cutoff:
            priority = "low"
            action = "Community Recognition"
            message = (
                f"{row.neighborhood_name} is performing well! "
                f"Efficiency score ({efficiency_score:.2f} kWh/household) "
                f"is at or below the cutoff ({efficiency_cutoff:.2f}) "
                "over the selected window."
            )
            recommendations.append(
                {
                    "neighborhood": row.neighborhood_name,
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
                        "neighborhood": row.neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            f"{row.neighborhood_name} uses more energy "
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
                        "neighborhood": row.neighborhood_name,
                        "score": efficiency_score,
                        "message": (
                            f"Target efficiency improvements for "
                            f"{row.neighborhood_name}. "
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
