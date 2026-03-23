from __future__ import annotations

from typing import Any, Optional

from sqlalchemy import func, select

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import VALID_WINDOWS, get_window_start_date


def get_efficiency_metrics(
    window: str = "30d",
    neighborhood_id: Optional[int] = None,
) -> list[dict[str, Any]]:
    """
    Return aggregated metrics required by the recommendations rules engine.

    Returned item shape:
        {
            "neighborhood_id": int,
            "neighborhood": str,
            "households": int,
            "total_kwh": float,
            "efficiency_score": float,  # total_kwh / households
        }
    """
    normalized_window = window.strip().lower()
    if normalized_window not in VALID_WINDOWS:
        return []

    energy_filters = []
    if neighborhood_id is not None:
        energy_filters.append(
            EnergyRecord.neighborhood_id == neighborhood_id
        )

    latest_date_stmt = select(func.max(EnergyRecord.date))
    if energy_filters:
        latest_date_stmt = latest_date_stmt.where(*energy_filters)

    latest_record_date = db.session.execute(latest_date_stmt).scalar_one()
    if latest_record_date is None:
        return []

    start_date = get_window_start_date(
        normalized_window, latest_record_date
    )
    if start_date is not None:
        energy_filters.append(EnergyRecord.date >= start_date)

    metrics_stmt = (
        select(
            Neighborhood.neighborhood_id,
            Neighborhood.neighborhood_name,
            Neighborhood.households,
            func.coalesce(func.sum(EnergyRecord.total_kwh), 0).label(
                "total_kwh"
            ),
        )
        .select_from(Neighborhood)
        .join(
            EnergyRecord,
            EnergyRecord.neighborhood_id == Neighborhood.neighborhood_id,
        )
        .where(*energy_filters)
        .group_by(
            Neighborhood.neighborhood_id,
            Neighborhood.neighborhood_name,
            Neighborhood.households,
        )
    )

    rows = db.session.execute(metrics_stmt).all()

    metrics: list[dict[str, Any]] = []
    for row in rows:
        households = int(row.households or 0)
        if households <= 0:
            continue

        total_kwh = float(row.total_kwh or 0)
        efficiency_score = total_kwh / households

        metrics.append(
            {
                "neighborhood_id": int(row.neighborhood_id),
                "neighborhood": row.neighborhood_name,
                "households": households,
                "total_kwh": total_kwh,
                "efficiency_score": efficiency_score,
            }
        )

    return metrics
