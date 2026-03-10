from datetime import date
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func, distinct

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


"""Service-layer logic for the dashboard overview endpoint (/api/dashboard)."""


VALID_WINDOWS = {"30d", "90d", "all"}
VALID_GRANULARITIES = {"day", "week"}


def get_dashboard_overview(
    window: str = "30d",
    neighborhood_id_raw: str = "1",
    granularity: str = "day",
    ) -> tuple[Dict[str, Any], int]:
    """Return dashboard KPI and time series data for request filters."""
    normalized_window = window.strip().lower()
    normalized_granularity = granularity.strip().lower()

    if normalized_window not in VALID_WINDOWS:
        return {
            "error": "invalid window; expected: '30d', '90d', or 'all'"
        }, 400
    
    if normalized_granularity not in VALID_GRANULARITIES:
        return {
            "error": "invalid granularity; expected: 'day' or 'week'"
        }, 400
    
    try:
        neighborhood_id = int(neighborhood_id_raw)
    except (TypeError, ValueError):
        return {
            "error": "invalid neighborhood_id; expected an integer"
        }, 400
    
    # filters = []
    # if date_from:
    #     filters.append(EnergyRecord.date >= date_from)
    # if date_to:
    #     filters.append(EnergyRecord.date <= date_to)

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

    # total kwh
    total_stmt = select(func.coalesce(func.sum(EnergyRecord.total_kwh), 0.0))
    if filters:
        total_stmt = total_stmt.where(*filters)
    consumption_kwh = float(db.session.execute(total_stmt).scalar_one())

    # Neighborhood count (distinct in filtered set)
    n_stmt = select(func.count(distinct(EnergyRecord.neighborhood_id)))
    if filters:
        n_stmt = n_stmt.where(*filters)
    neighborhood_count = int(db.session.execute(n_stmt).scalar_one())

    avg_kwh_per_household = (
        consumption_kwh / neighborhood_count if neighborhood_count else 0.0
    )

    # Timeseries grouped by day
    ts_stmt = (
        select(
            EnergyRecord.date.label("day"),
            func.coalesce(func.sum(EnergyRecord.total_kwh), 0.0).label("kwh"),
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
            "consumption_kwh": consumption_kwh,
            "total_kwh": consumption_kwh,
            "avg_kwh_per_household": avg_kwh_per_household,
            "neighborhood_count": neighborhood_count,
        },
        "timeseries": timeseries,
    }
