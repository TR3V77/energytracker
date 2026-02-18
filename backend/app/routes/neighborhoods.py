from flask import Blueprint, jsonify
from app.services.energy_service import get_all_neighborhoods

neighborhoods_bp = Blueprint('neighborhoods', __name__)


@neighborhoods_bp.route('/api/neighborhoods')
def list_neighborhoods():
    """List all neighborhoods."""
    neighborhoods = get_all_neighborhoods()
    return jsonify([n.to_dict() for n in neighborhoods])
