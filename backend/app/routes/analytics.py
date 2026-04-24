from datetime import timedelta

from flask import Blueprint, request, jsonify
from sqlalchemy import func, select

from app.exceptions import ServiceError
from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.services import analytics_service
from app.services import recommendations_service
from app.utils.date_window import parse_iso_date

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/api/analytics/rankings')
def efficiency_rankings():
    """Leaderboard: generatedAt, window, rows."""
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
    neighborhood_id = request.args.get(
        "neighborhood_id", type=int
    )
    anchor_date = request.args.get("anchor_date")

    try:
        recs = recommendations_service.get_recommendations(
            threshold=threshold,
            window=window,
            neighborhood_id=neighborhood_id,
            anchor_date=anchor_date,
        )
    except ServiceError as err:
        return jsonify({"error": err.message}), err.status_code

    if not recs:
        return jsonify({
            "recommendations": recs,
            "message": (
                "No recommendations triggered "
                "for the selected filters."
            ),
        }), 200

    return jsonify({
        "recommendations": recs,
        "message": "Recommendations generated successfully.",
    }), 200


def get_window_date_from(window: str):
    """Convert window param to start date from latest record."""
    latest = db.session.execute(
        select(func.max(EnergyRecord.date))
    ).scalar_one()

    if latest is None:
        return None
    if window == "30d":
        return latest - timedelta(days=30)
    if window == "90d":
        return latest - timedelta(days=90)
    return None


@analytics_bp.route('/api/leaderboard/efficiency')
def leaderboard_efficiency():
    """Efficiency leaderboard with optional window/date."""
    window = request.args.get("window", default="all")
    date_from = parse_iso_date(request.args.get("date_from"))
    date_to = parse_iso_date(request.args.get("date_to"))

    if window == "all_time":
        window = "all"

    if (date_from is None) != (date_to is None):
        return jsonify({
            "error": (
                "Both date_from and date_to are "
                "required when filtering by date."
            ),
        }), 400

    if date_from and date_to:
        actual_days = (date_to - date_from).days

        if window == "30d" and actual_days != 30:
            return jsonify({
                "error": (
                    f"Window '30d' requires exactly 30 days "
                    f"but date range spans {actual_days} days."
                ),
            }), 400

        if window == "90d" and actual_days != 90:
            return jsonify({
                "error": (
                    f"Window '90d' requires exactly 90 days "
                    f"but date range spans {actual_days} days."
                ),
            }), 400

        if date_from > date_to:
            return jsonify({
                "error": "date_from must be before date_to.",
            }), 400

    if date_from is None and date_to is None:
        date_from = get_window_date_from(window)

    try:
        data = analytics_service.get_efficiency_rankings(
            date_from=date_from,
            date_to=date_to,
        )
    except ServiceError as err:
        return jsonify({"error": err.message}), err.status_code

    return jsonify(data), 200
