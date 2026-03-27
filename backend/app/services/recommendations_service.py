from __future__ import annotations

from typing import Any, Optional

from app.services.efficiency_metrics_service import get_efficiency_metrics
from app.services.recommendation_rules import evaluate_recommendation_rules

"""
Service-layer logic for the recommendations endpoint.

This module fetches metrics and delegates pure rule evaluation to the
deterministic rules engine.
"""


def get_recommendations(
    threshold: float = 400.0,
    window: str = "30d",
    neighborhood_id: Optional[int] = None,
) -> list[dict[str, Any]]:
    """
    Return recommendations grouped by evaluated neighborhood.
    """
    metrics = get_efficiency_metrics(
        window=window,
        neighborhood_id=neighborhood_id,
    )

    return [
        evaluate_recommendation_rules(metric, threshold=threshold)
        for metric in metrics
    ]