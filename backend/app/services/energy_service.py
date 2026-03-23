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
) -> dict[str, Any]:

    # Determine time window
    end_date = datetime.utcnow().date()
    start_date = None

    if time_window == "30d":
        start_date = end_date - timedelta(days=30)
    elif time_window == "90d":
        start_date = end_date - timedelta(days=90)

    # Base query
    query = EnergyRecord.query.filter(
        EnergyRecord.neighborhood_id == neighborhood_id
    )

    if start_date:
        query = query.filter(EnergyRecord.date >= start_date)

    # Daily aggregation
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

    # Summary aggregation
    summary = (
        query.with_entities(
            func.sum(EnergyRecord.total_kwh),
            func.avg(EnergyRecord.total_kwh),
            func.max(EnergyRecord.total_kwh),
            func.min(EnergyRecord.total_kwh),
            func.count(EnergyRecord.id),
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

    total_kwh = float(summary[0] or 0)
    avg_kwh = float(summary[1] or 0)
    peak_kwh = float(summary[2] or 0)
    min_kwh = float(summary[3] or 0)
    reading_count = int(summary[4] or 0)

    return {
        "neighborhood_id": neighborhood_id,
        "time_window": time_window,
        "summary": {
            "total_kwh": total_kwh,
            "avg_kwh": avg_kwh,
            "peak_kwh": peak_kwh,
            "min_kwh": min_kwh,
            "reading_count": reading_count,
        },
        "daily_data": daily_data,
    }