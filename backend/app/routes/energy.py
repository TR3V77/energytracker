from flask import Blueprint, jsonify

energy_bp = Blueprint('energy', __name__)


@energy_bp.route('/api/energy')
def get_energy_data():
    """Get energy records with optional filters."""
    # TODO: Implement filtering by neighborhood, date range
    return jsonify({
        "records": [],
        "message": "Energy data endpoint - not yet implemented"
    }), 501
