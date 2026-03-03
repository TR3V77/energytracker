from datetime import date
from typing import Optional, Dict, Any, List

"""Service-layer logic for the dashboard overview endpoint (/api/dashboard)."""

# Later import SQLAlchemy models & session here, e.g.:
from sqlalchemy import select, func, distinct
from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def get_dashboard_overview(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
) -> Dict[str, Any]:
    """
    Compute high-level dashboard metrics and a simple kwh timeseries.

    Returns:
        {
            "hasData": bool,
            "message": str | None,
            "kpis": {
                "total_kwh": float,
                "avg_kwh_per_household": float,
                "neighborhood_count": int,
            } | None,
            "timeseries": List[{"date": str, "kwh": float}],
        }
    """

    # TODO: Replace this MOCK with the real SQLAlchemy aggregation
    # For now, return stubbed data so frontend can build Overview UI.

    timeseries: List[Dict[str, Any]] = [
        {"date": "2025-01-01", "kwh": 100.0},
        {"date": "2025-01-02", "kwh": 120.5},
        {"date": "2025-01-03", "kwh": 98.3},
    ]

    total_kwh = sum(point["kwh"] for point in timeseries)
    neighborhood_count = 3  # mock number for now
    total_households = 150  # mock number for now

    avg_kwh_per_household = (
        total_kwh / total_households if total_households > 0 else 0.0
    )

    return {
        "hasData": True,
        "message": None,
        "kpis": {
            "total_kwh": total_kwh,
            "avg_kwh_per_household": avg_kwh_per_household,
            "neighborhood_count": neighborhood_count,
        },
        "timeseries": timeseries,
    }
