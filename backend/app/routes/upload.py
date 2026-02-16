from flask import Blueprint, request, jsonify
from app.services.upload_service import process_upload

upload_bp = Blueprint('upload', __name__)


@upload_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a CSV or JSON energy dataset."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ('csv', 'json'):
        return jsonify({"error": "File must be CSV or JSON"}), 400

    try:
        upload = process_upload(file, file.filename)
        return jsonify(upload.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
