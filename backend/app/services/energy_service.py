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
        energy_type = None
    ):
    """Query energy records with optional filters."""
    query = EnergyRecord.query

    if neighborhood_id:
        query = query.filter(EnergyRecord.neighborhood_id == neighborhood_id)
    if energy_type:
        query = query.filter(EnergyRecord.energy_type == energy_type)
    if start_date:
        query = query.filter(
            EnergyRecord.date >= datetime.strptime(
                start_date, '%Y-%m-%d').date()
        )
    if end_date:
        query = query.filter(
            EnergyRecord.date <= datetime.strptime(end_date, '%Y-%m-%d').date()
        )

    return query.order_by(EnergyRecord.date).all()
