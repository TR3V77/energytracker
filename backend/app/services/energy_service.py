from datetime import datetime, timedelta
from typing import Literal, Any

from sqlalchemy import func

from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood

TimeWindow = Literal["30d", "90d", "all"]


def get_all_neighborhoods():
    """Return all neighborhoods ordered by name."""
    return Neighborhood.query.order_by(Neighborhood.neighborhood_name).all()


def get_energy_data(
        neighborhood_id=None,
        start_date=None,
        end_date=None,
):
    """Query energy records with optional filters."""
    query = EnergyRecord.query

    if neighborhood_id is not None:
        query = query.filter(EnergyRecord.neighborhood_id == neighborhood_id)

    if start_date:
        parsed_start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        query = query.filter(EnergyRecord.date >= parsed_start_date)

    if end_date:
        parsed_end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        query = query.filter(EnergyRecord.date <= parsed_end_date)

    return query.order_by(EnergyRecord.date.asc()).all()


def get_neighborhood_energy_metrics(
    neighborhood_id: int,
    time_window: TimeWindow = "30d",
    anchor_date: str | None = None,
) -> dict[str, Any]:
    """Return aggregated energy metrics for a neighborhood and time window."""

    neighborhood = Neighborhood.query.filter(
        Neighborhood.neighborhood_id == neighborhood_id
    ).first()

    if neighborhood is None:
        raise ValueError(f"Neighborhood '{neighborhood_id}' not found.")

    if anchor_date:
        try:
            end_date = datetime.strptime(anchor_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("anchor_date must be in YYYY-MM-DD format")
    else:
        latest_record_date = (
            EnergyRecord.query.with_entities(func.max(EnergyRecord.date))
            .filter(EnergyRecord.neighborhood_id == neighborhood_id)
            .scalar()
        )

        if latest_record_date is None:
            return {
                "neighborhood_id": neighborhood.neighborhood_id,
                "neighborhood_name": neighborhood.neighborhood_name,
                "time_window": time_window,
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

        end_date = latest_record_date

    start_date = None

    if time_window == "30d":
        start_date = end_date - timedelta(days=30)
    elif time_window == "90d":
        start_date = end_date - timedelta(days=90)
    elif time_window == "all":
        start_date = None
    else:
        raise ValueError("time_window must be one of: '30d', '90d', 'all'")

    query = EnergyRecord.query.filter(
        EnergyRecord.neighborhood_id == neighborhood_id
    )

    if start_date is not None:
        query = query.filter(EnergyRecord.date >= start_date)

    if time_window != "all":
        query = query.filter(EnergyRecord.date <= end_date)

    daily_results = (
        query.with_entities(
            EnergyRecord.date.label("day"),
            func.sum(EnergyRecord.total_kwh).label("total_kwh"),
            func.avg(EnergyRecord.total_kwh).label("avg_kwh"),
            func.max(EnergyRecord.total_kwh).label("peak_kwh"),
            func.min(EnergyRecord.total_kwh).label("min_kwh"),
            func.count(EnergyRecord.id).label("reading_count"),
        )
        .group_by(EnergyRecord.date)
        .order_by(EnergyRecord.date)
        .all()
    )

    summary = (
        query.with_entities(
            func.sum(EnergyRecord.total_kwh).label("total_kwh"),
            func.avg(EnergyRecord.total_kwh).label("avg_kwh"),
            func.max(EnergyRecord.total_kwh).label("peak_kwh"),
            func.min(EnergyRecord.total_kwh).label("min_kwh"),
            func.count(EnergyRecord.id).label("reading_count"),
        )
        .first()
    )

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
        "time_window": time_window,
        "anchor_date": anchor_date if anchor_date else end_date.isoformat(),
        "date_range": {
            "start": start_date.isoformat() if start_date else None,
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
