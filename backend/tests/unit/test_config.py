import pytest
from pydantic import ValidationError

from app.core.config import Settings

pytestmark = pytest.mark.unit


def test_lee_la_configuracion_desde_variables_de_entorno(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@db:5432/prod")
    monkeypatch.setenv("CORS_ORIGINS", '["https://portal.example"]')

    settings = Settings(_env_file=None)

    assert settings.environment == "production"
    assert settings.database_url == "postgresql+asyncpg://u:p@db:5432/prod"
    assert settings.cors_origins == ["https://portal.example"]


def test_rechaza_un_entorno_desconocido():
    with pytest.raises(ValidationError):
        Settings(_env_file=None, environment="staging")


def test_rechaza_un_tiempo_limite_no_positivo():
    with pytest.raises(ValidationError):
        Settings(_env_file=None, db_health_timeout_seconds=0)
