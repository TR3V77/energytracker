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

    min_record_date, max_record_date = db.session.execute(
        select(
            func.min(EnergyRecord.date),
            func.max(EnergyRecord.date),
        ).where(*filter_conditions)
    ).one()

    household_count = db.session.execute(
        select(Neighborhood.households)
        .where(Neighborhood.neighborhood_id == neighborhood_id)
    ).scalar_one()

    total_days = (
        (max_record_date - min_record_date).days + 1
        if min_record_date and max_record_date
        else 0
    )

    # average_kwh_per_day = total_kwh / total_days if total_days > 0 else 0.0
    # average_kwh_per_household = (
    #     total_kwh / household_count if household_count else 0.0
    # )

    period_expression = _get_period_expression(normalized_granularity)

    time_series_rows = db.session.execute(
        select(
            period_expression.label("period"),
            func.coalesce(func.sum(EnergyRecord.total_kwh), 0).label("total_kwh"),
        )
        .where(*filter_conditions)
        .group_by(period_expression)
        .order_by(period_expression)
    ).all()

    time_series = [
        {
        "period": row.period.isoformat(),
        "total_kwh": float(row.total_kwh),
        }
        for row in time_series_rows
    ]

    return {
        **base_response,
        "has_data": True,
        "message": None,
        "kpis": {
            "total_kwh": total_kwh,
            # "average_kwh_per_day": average_kwh_per_day,
            # "average_kwh_per_household": average_kwh_per_household,
            "household_count": int(household_count),
            "neighborhood_count": 1,
            "date_range": {
                "start": min_record_date.isoformat(),
                "end": max_record_date.isoformat(),
            },
        },
        "time_series": time_series,
    }, 200

def _get_window_start_date(window: str):
    """Convert suppoerted window string into start date"""
    today = datetime.itcnow().date()

    if window == "30d":
        return today - timedelta(days = 30)
    
    if window == "90d":
        return today - timedelta(days = 90)
    
    return None

def _get_utc_timestamp() -> str:
    """Return compact utc timestamp for API responses."""
    return (
        datetime.now(timezone.utc)
        .replace(microsecond = 0)
        .isoformat()
        .replce("+000:00", "Z")
    )