from __future__ import annotations

from datetime import timedelta
from typing import Any, Optional

from sqlalchemy import select, func

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood

"""
Service-layer logic for the recommendations endpoint.

This module should control data access and apply recommendation rules.
Keep Flask request/response concerns in the route layer, and keep pure rule
logic in a separate module if/when it grows.
"""

VALID_WINDOWS = {"30d", "90d", "all"}


def get_recommendations(
    threshold: float = 400.0,
    window: str = "30d",
    neighborhood_id: Optional[int] = None,
) -> list[dict[str, Any]]:
    """
    Return rule-based recommendations.

    Response item shape (intended):
        {
            "neighborhood_id": int,
            "neighborhood": str,
            "efficiency_score": float,  # kWh per household over window
            "estimated_impact_pct": float,
            "recommendation": str,
        }
    """

    normalized_window = window.strip().lower()
    if normalized_window not in VALID_WINDOWS:
        # Route layer can translate this to 400 for raising exceptions
        # for now we keep a simple "return empty" contract.
        return []

    filters = []
    if neighborhood_id is not None:
        filters.append(EnergyRecord.neighborhood_id == neighborhood_id)

    latest_date_stmt = select(func.max(EnergyRecord.date))
    if filters:
        latest_date_stmt = latest_date_stmt.where(*filters)

    latest_record_date = db.session.execute(latest_date_stmt).scalar_one()

    if latest_record_date is None:
        return []

    start_date = _get_window_start_date(normalized_window, latest_record_date)
    if start_date is not None:
        filters.append(EnergyRecord.date >= start_date)

    # NOTE: Intentionally minimal; will plug in the actual
    # rules + queries next once rule set confirmed.
    _ = threshold
    _ = filters
    return []


def _get_window_start_date(window: str, latest_record_date):
    if window == "30d":
        return latest_record_date - timedelta(days=30)
    if window == "90d":
        return latest_record_date - timedelta(days=90)
    return None
