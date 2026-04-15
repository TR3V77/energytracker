"""Analytics services for rankings, trends, and recommendations."""

from datetime import date
from typing import Any, Dict, List, Optional

from sqlalchemy import func, select, extract

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.services.efficiency_metrics_service import list_efficiency_rankings


def get_efficiency_rankings(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
) -> Dict[str, List[Dict[str, Any]]]:
    """Compute efficiency rankings for neighborhoods from stored readings."""
    result = list_efficiency_rankings(date_from=date_from, date_to=date_to)
    
    return {
    "rankings": result["rankings"],
    "warnings": result["warnings"],
}


def get_trends(
    neighborhood_id: Optional[int] = None
) -> List[Dict[str, Any]]:
    """Calculate month-over-month consumption trends.

    Groups energy records by year-month, sums total_kwh, and computes
    the percentage change from the previous month.
    """
    year_col = extract("year", EnergyRecord.date).label("year")
    month_col = extract("month", EnergyRecord.date).label("month")

    stmt = (
        select(
            year_col,
            month_col,
            func.sum(EnergyRecord.total_kwh).label("total_kwh"),
        )
        .group_by(year_col, month_col)
        .order_by(year_col, month_col)
    )

    if neighborhood_id is not None:
        stmt = stmt.where(EnergyRecord.neighborhood_id == neighborhood_id)

    rows = db.session.execute(stmt).all()

    trends: List[Dict[str, Any]] = []
    prev_kwh: Optional[float] = None

    for row in rows:
        kwh = float(row.total_kwh)
        pct_change = None
        if prev_kwh is not None and prev_kwh > 0:
            pct_change = round(((kwh - prev_kwh) / prev_kwh) * 100, 2)

        trends.append({
            "period": f"{int(row.year)}-{int(row.month):02d}",
            "kwh": kwh,
            "pct_change": pct_change,
        })
        prev_kwh = kwh

    return trends
