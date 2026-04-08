from __future__ import annotations

from typing import Any, Optional
from datetime import date

from sqlalchemy import func, select

from app.exceptions import ServiceError
from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import (
    VALID_WINDOWS, get_window_start_date, parse_iso_date,
)


def get_efficiency_metrics(
    window: str = "30d",
    neighborhood_id: Optional[int] = None,
    anchor_date: Optional[str] = None,
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

    Raises:
        ServiceError: 400 if ``window`` or ``anchor_date`` is invalid.
        Valid filters with no matching readings return an empty list.
    """
    normalized_window = window.strip().lower()
    if normalized_window not in VALID_WINDOWS:
        raise ServiceError(
            "invalid window; expected: '30d', '90d', or 'all'",
            status_code=400,
        )

    parsed_anchor_date: Optional[date] = parse_iso_date(anchor_date)
    if anchor_date and parsed_anchor_date is None:
        raise ServiceError(
            "anchor_date must be YYYY-MM-DD",
            status_code=400,
        )

    energy_filters = []
    if neighborhood_id is not None:
        energy_filters.append(
            EnergyRecord.neighborhood_id == neighborhood_id
        )

    if parsed_anchor_date is not None:
        end_date = parsed_anchor_date
    else:
        latest_date_stmt = select(func.max(EnergyRecord.date))
        if energy_filters:
            latest_date_stmt = latest_date_stmt.where(*energy_filters)

        end_date = db.session.execute(latest_date_stmt).scalar_one()
        if end_date is None:
            return []

    if normalized_window != "all":
        start_date = get_window_start_date(
            normalized_window, end_date
        )
        if start_date is not None:
            energy_filters.append(EnergyRecord.date >= start_date)

    energy_filters.append(EnergyRecord.date <= end_date)

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


def list_efficiency_rankings(
    date_from: date | None = None,
    date_to: date | None = None,
) -> list[dict[str, Any]]:
    """Aggregate kWh per neighborhood and rank by kWh per household (desc).

    Uses the same join and efficiency definition as ``get_efficiency_metrics``.
    Optional ``date_from`` / ``date_to`` bound ``EnergyRecord.date`` (inclusive).
    """
    energy_filters: list[Any] = []
    if date_from is not None:
        energy_filters.append(EnergyRecord.date >= date_from)
    if date_to is not None:
        energy_filters.append(EnergyRecord.date <= date_to)

    total_kwh_expr = func.coalesce(
        func.sum(EnergyRecord.total_kwh), 0
    ).label("total_kwh")

    stmt = (
        select(
            Neighborhood.neighborhood_id,
            Neighborhood.neighborhood_name,
            Neighborhood.households,
            total_kwh_expr,
        )
        .select_from(Neighborhood)
        .join(
            EnergyRecord,
            EnergyRecord.neighborhood_id == Neighborhood.neighborhood_id,
        )
    )
    if energy_filters:
        stmt = stmt.where(*energy_filters)
    stmt = stmt.group_by(
        Neighborhood.neighborhood_id,
        Neighborhood.neighborhood_name,
        Neighborhood.households,
    ).having(Neighborhood.households > 0)

    rows = db.session.execute(stmt).all()

    rankings: list[dict[str, Any]] = []
    for row in rows:
        households = int(row.households or 0)
        total_kwh = float(row.total_kwh or 0)
        score = total_kwh / households
        rankings.append(
            {
                "neighborhood_id": int(row.neighborhood_id),
                "neighborhood_name": row.neighborhood_name,
                "efficiency": score,
                "households": households,
                "total_kwh": total_kwh,
            }
        )

    rankings.sort(key=lambda r: r["efficiency"])
    for i, entry in enumerate(rankings, start=1):
        entry["rank"] = i
    return rankings
