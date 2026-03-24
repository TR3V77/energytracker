import pytest
from datetime import date

from app import create_app
from app.extensions import db as _db
from app.models.neighborhood import Neighborhood
from app.models.energy_record import EnergyRecord


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app('testing')

    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app):
    """Create a test client."""
    return app.test_client()


@pytest.fixture(autouse=True)
def seed_data(app):
    """Seed the test DB with a neighborhood and energy record."""
    with app.app_context():
        neighborhood = Neighborhood(
            neighborhood_id=1,
            neighborhood_name="Test Neighborhood",
            households=10,
        )
        _db.session.add(neighborhood)

        record = EnergyRecord(
            neighborhood_id=1,
            date=date(2026, 1, 15),
            total_kwh=100.0,
        )
        _db.session.add(record)
        _db.session.commit()
