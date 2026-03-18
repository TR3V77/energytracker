from __future__ import annotations

from datetime import timedelta
from typing import Any, Optional

from sqlalchemy import select, func

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood

"""
Service-layer logic for the recommendations endpoint.

This module should orchestrate data access and apply recommendation rules.
Keep Flask request/response concerns in the route layer, and keep pure rule
logic in a separate module if/when it grows (e.g., app/rules/).
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
