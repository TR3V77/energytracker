"""Service-layer logic for the dashboard overview endpoint (/api/dashboard)."""

from typing import Any

from sqlalchemy import func, select

from app.exceptions import ServiceError
from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import VALID_WINDOWS, get_window_start_date


VALID_GRANULARITIES = {"day", "week"}


def get_dashboard_overview(
    window: str = "30d",
    neighborhood_id_raw: str = "1",
    granularity: str = "day",
) -> dict[str, Any]:
    """Return dashboard KPI and time series data for request filters."""
    normalized_window = window.strip().lower()
    normalized_granularity = granularity.strip().lower()

    if normalized_window not in VALID_WINDOWS:
        raise ServiceError(
            "invalid window; expected: '30d', '90d', or 'all'",
            status_code=400,
        )

    if normalized_granularity not in VALID_GRANULARITIES:
        raise ServiceError(
            "invalid granularity; expected: 'day' or 'week'",
            status_code=400,
        )

    try:
        neighborhood_id = int(neighborhood_id_raw)
    except (TypeError, ValueError) as exc:
        raise ServiceError(
            "invalid neighborhood_id; expected an integer",
            status_code=400,
        ) from exc

    neighborhood_exists = db.session.execute(
        select(func.count())
        .select_from(Neighborhood)
        .where(Neighborhood.neighborhood_id == neighborhood_id)
    ).scalar_one()

    if neighborhood_exists == 0:
        raise ServiceError("neighborhood not found", status_code=404)

    latest_record_date = db.session.execute(
        select(func.max(EnergyRecord.date))
        .where(EnergyRecord.neighborhood_id == neighborhood_id)
    ).scalar_one()

    if latest_record_date is None:
        return {
            "filters": {
                "window": normalized_window,
                "neighborhood_id": neighborhood_id,
                "granularity": normalized_granularity,
            },
            "unit": "kwh",
            "has_data": False,
            "message": "no dashboard data found for the selected filters",
            "kpis": None,
            "time_series": [],
        }

    filter_conditions = [
        EnergyRecord.neighborhood_id == neighborhood_id,
        EnergyRecord.date <= latest_record_date,
    ]

    start_date = get_window_start_date(
        normalized_window, latest_record_date
    )
    if start_date is not None:
        filter_conditions.append(EnergyRecord.date >= start_date)

    response_filters = {
        "window": normalized_window,
        "neighborhood_id": neighborhood_id,
        "granularity": normalized_granularity,
    }

    base_response = {
        "unit": "kwh",
        "filters": response_filters,
    }

    record_count = db.session.execute(
        select(func.count(EnergyRecord.id)).where(*filter_conditions)
    ).scalar_one()

    if int(record_count) == 0:
        return {
            **base_response,
            "has_data": False,
            "message": "no dashboard data found for the selected filters",
            "kpis": None,
            "time_series": [],
        }

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

    period_expression = _get_period_expression(normalized_granularity)

    time_series_rows = db.session.execute(
        select(
            period_expression.label("period"),
            func.coalesce(
                func.sum(EnergyRecord.total_kwh), 0
            ).label("total_kwh"),
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
            "household_count": int(household_count),
            "neighborhood_count": 1,
            "date_range": {
                "start": min_record_date.isoformat(),
                "end": max_record_date.isoformat(),
            },
        },
        "time_series": time_series,
    }


def _get_period_expression(granularity: str):
    """Return SQL for dashboard time series grouping"""
    if granularity == "week":
        return func.date_trunc("week", EnergyRecord.date).cast(db.Date)

    return EnergyRecord.date
