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
    # TODO: Call analytics_service.get_trends
    return jsonify({
        "trends": [],
        "message": "Trends endpoint - not yet implemented"
    }), 501


@analytics_bp.route('/api/analytics/recommendations')
def recommendations():
    """Get rule-based energy recommendations.

    Expected response shape per item:
    {
        "neighborhood_id": 1,
        "neighborhood": "Downtown",
        "efficiency_score": 450,
        "estimated_impact_pct": 12.5,
        "recommendation": "Downtown uses 450 kWh per household..."
    }
    """
    # TODO: Call analytics_service.get_recommendations
    return jsonify({
        "recommendations": [],
        "message": "Recommendations endpoint - not yet implemented"
    }), 501
