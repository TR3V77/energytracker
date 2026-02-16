from flask import Blueprint, jsonify

upload_bp = Blueprint('upload', __name__)


@upload_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a CSV or JSON energy dataset."""
    # TODO: Implement file parsing and validation
    return jsonify({
        "message": "Upload endpoint - not yet implemented",
        "status": "stub"
    }), 501
