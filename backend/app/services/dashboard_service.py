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

    neighborhood_exists = db.session.execute(
        select(function.count())
        .select_from(Neighborhood)
        .where(Neighborhood.neighborhood_id == neighborhood_id)
    ).scalar_one()

    if neighborhood_exists == 0:
        return {"error": "neighborhood not found"}, 404

    filter_conditions = [EnergyRecord.neighborhood_id == neighborhood_id]

    start_date = _get_window_start_date(normalized_window)
    if start_date is not None:
        filter_conditions.append(EnergyRecord.date >= start_date)

    response_filters = {
        "window": normalized_window,
        "neighborhood_id": neighborhood_id,
        "granularity": normalized_granularity,
    }

    base_response = {
        "generated_at": _get_utc_timestamp(),
        "unit": "kWh",
        "filters": response_filters,
    }

    if int(record_count) == 0:
        return {
            **base_response,
            "has_data": False,
            "message": "no dashboard data found for the selected filters",
            "kpis": None,
            "time_series": [],
        }, 200

    total_kwh = float(
        db.session.execute(
            select(func.coalesce(func.sum(EnergyRecord.total_kwh), 0))
            .where(*filter_conditions)
        ).scalar_one()
    )

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
