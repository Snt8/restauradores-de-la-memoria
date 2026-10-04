"""Fixtures compartidas. Las pruebas de integración usan una base de datos exclusiva."""

import os
from collections.abc import AsyncIterator, Iterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.infrastructure.db.base import Base
from app.infrastructure.db.database import Database
from app.main import create_app

DEFAULT_TEST_DATABASE_URL = (
    "postgresql+asyncpg://restauradores:restauradores@localhost:5433/restauradores_test"
)
UNREACHABLE_DATABASE_URL = "postgresql+asyncpg://nadie:nada@127.0.0.1:1/inexistente"
BACKEND_ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="session")
def test_database_url() -> str:
    return os.environ.get("TEST_DATABASE_URL", DEFAULT_TEST_DATABASE_URL)


def alembic_config_para(database_url: str) -> Config:
    config = Config(str(BACKEND_ROOT / "alembic.ini"))
    config.attributes["database_url"] = database_url
    config.attributes["configure_logger"] = False
    return config


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


@pytest.fixture(scope="session")
def esquema_migrado(test_database_url: str) -> None:
    """Deja la base de pruebas en la última migración una sola vez por sesión."""
    command.upgrade(alembic_config_para(test_database_url), "head")


@pytest.fixture(scope="session")
async def database(test_database_url: str, esquema_migrado: None) -> AsyncIterator[Database]:
    db = Database(test_database_url)
    yield db
    await db.dispose()


@pytest.fixture
async def bd_limpia(database: Database) -> Database:
    """Vacía todas las tablas antes de la prueba para que no dependa de las anteriores."""
    tablas = ", ".join(tabla.name for tabla in Base.metadata.sorted_tables)
    async with database.engine.begin() as conexion:
        await conexion.execute(text(f"TRUNCATE {tablas} RESTART IDENTITY CASCADE"))
    return database


@pytest.fixture
async def sesion(bd_limpia: Database) -> AsyncIterator[AsyncSession]:
    async with bd_limpia.open_session() as s:
        yield s
