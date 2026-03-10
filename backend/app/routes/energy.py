from flask import Blueprint, jsonify, request

from app.services.energy_service import get_energy_data as query_energy_data

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
