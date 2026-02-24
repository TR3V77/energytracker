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