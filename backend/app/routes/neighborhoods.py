from flask import Blueprint, jsonify

neighborhoods_bp = Blueprint('neighborhoods', __name__)


@neighborhoods_bp.route('/api/neighborhoods')
def list_neighborhoods():
    """List all neighborhoods."""
    # TODO: Query from database
    return jsonify({
        "neighborhoods": [],
        "message": "Neighborhoods endpoint - not yet implemented"
    }), 501
