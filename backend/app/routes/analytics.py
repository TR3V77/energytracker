from flask import Blueprint, request, jsonify
from datetime import date

from app.services import analytics_service

analytics_bp = Blueprint('analytics', __name__)

def _parse_date(param_name: str):
    """Helper to parse date_from=YYYY-MM-DD style query parameters"""
    value = request.args.get(param_name)
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None     # prob change to handle invalid date better later

@analytics_bp.route('/api/analytics/rankings')
def efficiency_rankings():
    """Get neighborhoods ranked by efficiency score."""
    # Call analytics_service.get_efficiency_rankings
    date_from = _parse_date("date_from")
    date_to = _parse_date("date_to")
    
    data = analytics_service.get_efficiency_rankings(date_from, date_to)
    
    # data already {"rankings": [...]}
    return jsonify(data), 200


@analytics_bp.route('/api/analytics/trends')
def trends():
    """Get month-over-month consumption trends."""
    # Call analytics_service.get_trends
    neighborhood_id = request.args.get("neighborhood_id", type=int)
    trends_data = analytics_service.get_trends(neighborhood_id)
    
    return jsonify({"trends": trends_data}), 200


@analytics_bp.route('/api/analytics/recommendations')
def recommendations():
    """Get rule-based energy recommendations."""

    # Call analytics_service.get_recommendations
    threshold = request.args.get("threshold", default=400.0, type=float)
    recs = analytics_service.get_recommendations(threshold)
    
    return jsonify({"recommendations": recs}), 200
