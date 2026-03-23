from __future__ import annotations

from typing import Any, Optional

from sqlalchemy import func, select

from app.extensions import db
from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood
from app.utils.date_window import VALID_WINDOWS, get_window_start_date
