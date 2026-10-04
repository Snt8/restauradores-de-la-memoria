import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from tests.conftest import UNREACHABLE_DATABASE_URL

pytestmark = pytest.mark.integration


def test_liveness_responde_ok(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_responde_ok_con_la_base_de_datos_disponible(client):
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "up"}


def test_readiness_responde_503_si_la_base_de_datos_no_esta_disponible(make_settings):
    settings = make_settings(database_url=UNREACHABLE_DATABASE_URL, db_health_timeout_seconds=1)

    with TestClient(create_app(settings)) as client:
        response = client.get("/api/v1/health/ready")

    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "database": "down"}


def test_cors_permite_el_origen_configurado(make_settings):
    settings = make_settings(cors_origins=["http://localhost:5173"])

    with TestClient(create_app(settings)) as client:
        response = client.get("/api/v1/health", headers={"Origin": "http://localhost:5173"})

    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_documentacion_oculta_en_produccion(make_settings):
    with TestClient(create_app(make_settings(environment="production"))) as client:
        assert client.get("/docs").status_code == 404
