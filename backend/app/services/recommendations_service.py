from __future__ import annotations

from datetime import timedelta
from typing import Any, Optional

from sqlalchemy import select, func

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood

"""
Service-layer logic for the recommendations endpoint.

This module should orchestrate data access and apply recommendation rules.
Keep Flask request/response concerns in the route layer, and keep pure rule
logic in a separate module if/when it grows (e.g., app/rules/).
"""