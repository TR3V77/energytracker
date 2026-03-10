from datetime import datetime

from app.models.energy_record import EnergyRecord
from app.models.neighborhood import Neighborhood


def get_all_neighborhoods():
    """Return all neighborhoods ordered by name."""
    return Neighborhood.query.order_by(Neighborhood.neighborhood_name).all()


def get_energy_data(
        neighborhood_id = None,
        start_date = None,
        end_date = None,
    ):
    """Query energy records with optional filters."""
    query = EnergyRecord.query

    if neighborhood_id is not None:
        query = query.filter(EnergyRecord.neighborhood_id == neighborhood_id)

    if start_date:
        parsed_start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        query = query.filter(EnergyRecord.date >= parsed_start_date)

    if end_date:
        parsed_end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        query = query.filter(EnergyRecord.date <= parsed_end_date)

    return query.order_by(EnergyRecord.date.asc()).all()
