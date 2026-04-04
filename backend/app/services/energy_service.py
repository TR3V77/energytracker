from __future__ import annotations

from typing import Any, Literal

from sqlalchemy import func, select

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import (
    VALID_WINDOWS,
    get_window_start_date,
    normalize_window,
    parse_iso_date,
)

TimeWindow = Literal["30d", "90d", "all"]


def get_all_neighborhoods():
    """Return all neighborhoods ordered by name."""
    stmt = select(Neighborhood).order_by(Neighborhood.neighborhood_name)
    return db.session.scalars(stmt).all()


def get_energy_data(
    neighborhood_id=None,
    start_date=None,
    end_date=None,
):
    """Query energy records with optional filters."""
    stmt = select(EnergyRecord).order_by(EnergyRecord.date.asc())

    if neighborhood_id is not None:
        stmt = stmt.where(EnergyRecord.neighborhood_id == neighborhood_id)

    if start_date:
        parsed_start = parse_iso_date(start_date)
        if parsed_start is None:
            raise ValueError("start_date must be YYYY-MM-DD")
        stmt = stmt.where(EnergyRecord.date >= parsed_start)

    if end_date:
        parsed_end = parse_iso_date(end_date)
        if parsed_end is None:
            raise ValueError("end_date must be YYYY-MM-DD")
        stmt = stmt.where(EnergyRecord.date <= parsed_end)

    return db.session.scalars(stmt).all()


def get_neighborhood_energy_metrics(
    neighborhood_id: int,
    time_window: TimeWindow = "30d",
    anchor_date: str | None = None,
) -> dict[str, Any]:
    """Return aggregated energy metrics for a neighborhood and time window.

    Window and anchor semantics match ``efficiency_metrics_service`` and
    ``dashboard_service``: ``all`` means from earliest data up to and including
    the resolved end date (anchor or latest reading).
    """
    normalized_window = normalize_window(time_window)
    if normalized_window not in VALID_WINDOWS:
        raise ValueError("time_window must be one of: '30d', '90d', 'all'")

    neighborhood = db.session.execute(
        select(Neighborhood).where(
            Neighborhood.neighborhood_id == neighborhood_id
        )
    ).scalar_one_or_none()

    if neighborhood is None:
        raise ValueError(f"Neighborhood '{neighborhood_id}' not found.")

    parsed_anchor = parse_iso_date(anchor_date) if anchor_date else None
    if anchor_date and parsed_anchor is None:
        raise ValueError("anchor_date must be in YYYY-MM-DD format")

    if parsed_anchor is not None:
        end_date = parsed_anchor
    else:
        end_date = db.session.execute(
            select(func.max(EnergyRecord.date)).where(
                EnergyRecord.neighborhood_id == neighborhood_id
            )
        ).scalar_one()

        if end_date is None:
            return {
                "neighborhood_id": neighborhood.neighborhood_id,
                "neighborhood_name": neighborhood.neighborhood_name,
                "time_window": normalized_window,
                "anchor_date": anchor_date,
                "date_range": {
                    "start": None,
                    "end": None,
                },
                "summary": {
                    "total_kwh": 0.0,
                    "avg_kwh_per_reading": 0.0,
                    "peak_kwh": 0.0,
                    "min_kwh": 0.0,
                    "reading_count": 0,
                    "days_returned": 0,
                    "avg_daily_kwh": 0,
                },
                "daily_data": [],
            }

    filters = [
        EnergyRecord.neighborhood_id == neighborhood_id,
        EnergyRecord.date <= end_date,
    ]

    window_start = None
    if normalized_window != "all":
        window_start = get_window_start_date(normalized_window, end_date)
        if window_start is not None:
            filters.append(EnergyRecord.date >= window_start)

    daily_stmt = (
        select(
            EnergyRecord.date.label("day"),
            func.sum(EnergyRecord.total_kwh).label("total_kwh"),
            func.avg(EnergyRecord.total_kwh).label("avg_kwh"),
            func.max(EnergyRecord.total_kwh).label("peak_kwh"),
            func.min(EnergyRecord.total_kwh).label("min_kwh"),
            func.count(EnergyRecord.id).label("reading_count"),
        )
        .where(*filters)
        .group_by(EnergyRecord.date)
        .order_by(EnergyRecord.date)
    )
    daily_results = db.session.execute(daily_stmt).all()

    summary_stmt = select(
        func.coalesce(func.sum(EnergyRecord.total_kwh), 0).label("total_kwh"),
        func.avg(EnergyRecord.total_kwh).label("avg_kwh"),
        func.max(EnergyRecord.total_kwh).label("peak_kwh"),
        func.min(EnergyRecord.total_kwh).label("min_kwh"),
        func.count(EnergyRecord.id).label("reading_count"),
    ).where(*filters)
    summary = db.session.execute(summary_stmt).one()

    daily_data = [
        {
            "date": row.day.isoformat(),
            "total_kwh": float(row.total_kwh or 0),
            "avg_kwh": float(row.avg_kwh or 0),
            "peak_kwh": float(row.peak_kwh or 0),
            "min_kwh": float(row.min_kwh or 0),
            "reading_count": int(row.reading_count or 0),
        }
        for row in daily_results
    ]

    total_kwh = float(summary.total_kwh or 0)
    avg_kwh = float(summary.avg_kwh or 0)
    peak_kwh = float(summary.peak_kwh or 0)
    min_kwh = float(summary.min_kwh or 0)
    reading_count = int(summary.reading_count or 0)

    avg_daily_kwh = round(total_kwh / len(daily_data), 2) if daily_data else 0

    return {
        "neighborhood_id": neighborhood.neighborhood_id,
        "neighborhood_name": neighborhood.neighborhood_name,
        "time_window": normalized_window,
        "anchor_date": anchor_date if anchor_date else end_date.isoformat(),
        "date_range": {
            "start": window_start.isoformat() if window_start else None,
            "end": end_date.isoformat(),
        },
        "summary": {
            "total_kwh": total_kwh,
            "avg_kwh_per_reading": round(avg_kwh, 2),
            "peak_kwh": peak_kwh,
            "min_kwh": min_kwh,
            "reading_count": reading_count,
            "days_returned": len(daily_data),
            "avg_daily_kwh": avg_daily_kwh,
        },
        "daily_data": daily_data,
    }
