from flask import Blueprint, request, jsonify
from app.services.energy_service import get_energy_data as query_energy_data

energy_bp = Blueprint('energy', __name__)


@energy_bp.route('/api/energy')
def get_energy_data():
    """Get energy records with optional filters.

    Query params:
        neighborhood_id (int): filter by neighborhood
        start_date (str): YYYY-MM-DD lower bound
        end_date (str): YYYY-MM-DD upper bound
        energy_type (str): electric, gas, etc.
    """
    neighborhood_id = request.args.get('neighborhood_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    energy_type = request.args.get('energy_type')

    records = query_energy_data(neighborhood_id, start_date, end_date,
                                energy_type)
    return jsonify([r.to_dict() for r in records])
