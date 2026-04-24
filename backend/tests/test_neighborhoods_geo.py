"""PROJ-115: Verify neighborhoods endpoint returns geographic fields."""

from app.extensions import db
from app.models.neighborhood import Neighborhood


def test_neighborhoods_include_geo_fields(app, client):
    """Neighborhoods response should include zip_code, latitude, longitude."""
    with app.app_context():
        n = db.session.get(Neighborhood, 1)
        n.zip_code = "78666"
        n.latitude = 29.8833
        n.longitude = -97.9414
        db.session.commit()

    response = client.get("/api/neighborhoods")
    assert response.status_code == 200

    data = response.get_json()
    first = data[0]
    assert "zip_code" in first
    assert "latitude" in first
    assert "longitude" in first
    assert first["zip_code"] == "78666"
    assert first["latitude"] == 29.8833
    assert first["longitude"] == -97.9414


def test_neighborhoods_geo_fields_nullable(client):
    """Geo fields should be null when not set."""
    response = client.get("/api/neighborhoods")
    assert response.status_code == 200

    data = response.get_json()
    first = data[0]
    assert first["zip_code"] is None
    assert first["latitude"] is None
    assert first["longitude"] is None
