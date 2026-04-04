import pytest

from app.exceptions import ServiceError
from app.services.efficiency_metrics_service import get_efficiency_metrics


def test_invalid_window_raises_service_error(app):
    with app.app_context():
        with pytest.raises(ServiceError) as exc_info:
            get_efficiency_metrics(window="not-a-window")
    assert exc_info.value.status_code == 400
    assert "window" in exc_info.value.message.lower()


def test_invalid_anchor_raises_service_error(app):
    with app.app_context():
        with pytest.raises(ServiceError) as exc_info:
            get_efficiency_metrics(anchor_date="99-99-99")
    assert exc_info.value.status_code == 400
    assert "anchor_date" in exc_info.value.message.lower()


def test_recommendations_invalid_window_returns_400(client):
    response = client.get("/api/recommendations?window=invalid")
    assert response.status_code == 400
    body = response.get_json()
    assert "error" in body


def test_recommendations_invalid_anchor_returns_400(client):
    response = client.get("/api/recommendations?anchor_date=notadate")
    assert response.status_code == 400
    body = response.get_json()
    assert "error" in body
