from flask import Blueprint, jsonify, request

from app.services.energy_service import (
    get_energy_data as query_energy_data,
    get_neighborhood_energy_metrics,
)

energy_bp = Blueprint("energy", __name__)


@energy_bp.route("/api/energy")
def get_energy_records():
    """Get energy records with optional filters."""
    neighborhood_id = request.args.get("neighborhood_id", type=int)
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    records = query_energy_data(
        neighborhood_id=neighborhood_id,
        start_date=start_date,
        end_date=end_date,
    )

    return jsonify([record.to_dict() for record in records]), 200


@energy_bp.route("/api/energy/metrics")
def get_energy_metrics():
    """Get aggregated energy metrics for recommendation system."""
    neighborhood_id = request.args.get("neighborhood_id", type=int)
    time_window = (
        request.args.get("time_window")
        or request.args.get("window")
        or "30d"
    )
    anchor_date = request.args.get("anchor_date")

    if neighborhood_id is None:
        return jsonify({"error": "neighborhood_id is required"}), 400

    try:
        data = get_neighborhood_energy_metrics(
            neighborhood_id=neighborhood_id,
            time_window=time_window,
            anchor_date=anchor_date,
        )
        return jsonify(data), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
