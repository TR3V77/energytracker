from datetime import date
from typing import Optional, Dict, Any, List

"""Service-layer logic for the dashboard overview endpoint (/api/dashboard)."""

# Later import SQLAlchemy models & session here, e.g.:
# from sqlalchemy import select, func
# from sqlalchemy.orm import Session
# from app.models.energy_record import EnergyRecord
# from app.models.neighborhood import Neighborhood
# from app.database import SessionLocal

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