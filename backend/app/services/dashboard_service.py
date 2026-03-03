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
    
    filters = []
    if date_from:
        filters.append(EnergyRecord.date >= date_from)
    if date_to:
        filters.append(EnergyRecord.date <= date_to)

    # Count rows to decide hasData
    count_stmt = select(func.count(EnergyRecord.id))
    if filters:
        count_stmt = count_stmt.where(*filters)
    record_count = int(db.session.execute(count_stmt).scalar_one())

    if record_count == 0:
        return {
            "hasData": False,
            "message": "Upload data to view your dashboard.",
            "kpis": None,
            "timeseries": [],
        }

    # Total kWh (consumption)
    total_stmt = select(func.coalesce(func.sum(EnergyRecord.total_kwh), 0))
    if filters:
        total_stmt = total_stmt.where(*filters)
    total_kwh = float(db.session.execute(total_stmt).scalar_one())

    # Neighborhood count (distinct in filtered set)
    n_stmt = select(func.count(distinct(EnergyRecord.neighborhood_id)))
    if filters:
        n_stmt = n_stmt.where(*filters)
    neighborhood_count = int(db.session.execute(n_stmt).scalar_one())

    # Total households from neighborhoods table
    households_stmt = select(func.coalesce(func.sum(Neighborhood.households), ))
    total_households = int(db.session.execute(households_stmt).scalar_one())

    avg_kwh_per_household = (
        total_kwh / total_households if total_households > 0 else 0.0
    )

    # Timeseries grouped by day
    ts_stmt = (
        select(
            EnergyRecord.date.label("day"),
            func.coalesce(func.sum(EnergyRecord.total_kwh), 0).label("kwh"),
        )
        .group_by(EnergyRecord.date)
        .order_by(EnergyRecord.date.asc())
    )
    if filters:
        ts_stmt = ts_stmt.where(*filters)

    rows = db.session.execute(ts_stmt).all()
    timeseries: List[Dict[str, Any]] = [
        {"date": r.day.isoformat(), "kwh": float(r.kwh)} for r in rows
    ]

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
