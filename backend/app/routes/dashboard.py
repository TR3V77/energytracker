from flask import Blueprint, request, jsonify

from app.services import dashboard_service

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/api/dashboard")
def dashboard_overview():
    """Return dashboard overview data for selected filters"""
    window = request.args.get("window", default = "30d")
    neighborhood_id = request.args.get("neighborhood_id", default = "1")
    granularity = request.args.get("granularity", default = "day")

    response_body, status_code = dashboard_service.get_dashboard_overview(
        window = window,
        neighborhood_id_raw = neighborhood_id,
        granularity = granularity,
    )

    return jsonify(response_body), status_code
