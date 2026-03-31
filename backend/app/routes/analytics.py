from flask import Blueprint, request, jsonify

from app.services import analytics_service
from app.services import recommendations_service
from app.utils.date_window import parse_iso_date

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/api/analytics/rankings')
def efficiency_rankings():
    """Get neighborhoods ranked by efficiency score."""
    date_from = parse_iso_date(request.args.get("date_from"))
    date_to = parse_iso_date(request.args.get("date_to"))

    data = analytics_service.get_efficiency_rankings(
        date_from, date_to
    )

    return jsonify(data), 200


@analytics_bp.route('/api/analytics/trends')
def trends():
    """Get month-over-month consumption trends."""
    neighborhood_id = request.args.get(
        "neighborhood_id", type=int
    )
    trends_data = analytics_service.get_trends(neighborhood_id)

    return jsonify({"trends": trends_data}), 200


@analytics_bp.route('/api/recommendations')
@analytics_bp.route('/api/analytics/recommendations')
def recommendations():
    """Get rule-based energy recommendations."""
    threshold = request.args.get(
        "threshold", default=400.0, type=float
    )
    window = request.args.get("window", default="30d")
    neighborhood_id = request.args.get("neighborhood_id", type=int)
    anchor_date = request.args.get("anchor_date")

    recs = recommendations_service.get_recommendations(
        threshold=threshold,
        window=window,
        neighborhood_id=neighborhood_id,
        anchor_date=anchor_date,
    )

    if not recs:
        return jsonify({
            "recommendations": recs,
            "message": "No recommendations triggered for the selected filters."
        }), 200

    return jsonify({
        "recommendations": recs,
        "message": "Recommendations generated successfully."
    }), 200