from flask import Blueprint, request, jsonify
from datetime import date
from typing import Optional

from app.services import dashboard_service

dashboard_bp = Blueprint("dashboard", __name__)