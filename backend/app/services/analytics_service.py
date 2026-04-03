"""Analytics services for rankings, trends, and recommendations."""

from datetime import date
from typing import Any, Dict, List, Optional

from app.services.efficiency_metrics_service import list_efficiency_rankings


def get_efficiency_rankings(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
) -> Dict[str, List[Dict[str, Any]]]:
    """Compute efficiency rankings for neighborhoods from stored readings."""
    rankings = list_efficiency_rankings(date_from=date_from, date_to=date_to)
    return {"rankings": rankings}


def get_trends(
    neighborhood_id: Optional[int] = None
) -> List[Dict[str, Any]]:
    """Calculate month-over-month consumption trends.

    Expected return shape:
        [
            {
                "period": "YYYY-MM",
                "kwh": float,
                "pct_change": float | None
            },
            ...
        ]
    """
    # TODO: Implement trend calculation
    return []
