"""Fixtures compartidas. Las pruebas de integración usan una base de datos exclusiva."""

import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app

DEFAULT_TEST_DATABASE_URL = (
    "postgresql+asyncpg://restauradores:restauradores@localhost:5433/restauradores_test"
)
UNREACHABLE_DATABASE_URL = "postgresql+asyncpg://nadie:nada@127.0.0.1:1/inexistente"


@pytest.fixture(scope="session")
def test_database_url() -> str:
    return os.environ.get("TEST_DATABASE_URL", DEFAULT_TEST_DATABASE_URL)


@pytest.fixture
def make_settings(test_database_url: str):
    """Construye Settings de prueba sin leer el .env del desarrollador."""

    def _make(**overrides) -> Settings:
        values = {"environment": "test", "database_url": test_database_url, **overrides}
        return Settings(_env_file=None, **values)

    return _make


@pytest.fixture
def client(make_settings) -> Iterator[TestClient]:
    with TestClient(create_app(make_settings())) as test_client:
        yield test_client
