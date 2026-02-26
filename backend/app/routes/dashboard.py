from flask import Blueprint, request, jsonify
from datetime import date
from typing import Optional

from app.services import dashboard_service

dashboard_bp = Blueprint("dashboard", __name__)

def _parse_date(param_name: str) -> Optional[date]:
    """Helper to parse date_from=YYYY-MM-DD style query parameters"""
    value = request.args.get(param_name)
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None     # prob change to handle invalid date better later
    
@dashboard_bp.route('/api/dashboard')
def dashboard_overview():
    """
    Dashboard overview: KPIs + timeseries for the main dashboard view.
    
    Query params(optional):
        - date_from=YYYY-MM-DD
        - date_to=YYYY-MM-DD
    """
    date_from = _parse_date("date_from")
    date_to = _parse_date("date_to")
    
    data = dashboard_service.get_dashboard_overview(date_from, date_to)
    
    return jsonify(data), 200