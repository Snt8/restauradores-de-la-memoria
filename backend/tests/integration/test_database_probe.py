import pytest
from sqlalchemy import text

from app.infrastructure.db.database import Database
from app.infrastructure.db.health import SqlAlchemyDatabaseProbe
from tests.conftest import UNREACHABLE_DATABASE_URL

pytestmark = pytest.mark.integration


async def test_ping_devuelve_true_contra_postgresql_real(test_database_url):
    database = Database(test_database_url)
    try:
        assert await SqlAlchemyDatabaseProbe(database.engine).ping() is True
    finally:
        await database.dispose()


async def test_ping_devuelve_false_si_no_hay_conexion():
    database = Database(UNREACHABLE_DATABASE_URL)
    try:
        assert await SqlAlchemyDatabaseProbe(database.engine).ping() is False
    finally:
        await database.dispose()


async def test_la_sesion_ejecuta_consultas_y_se_cierra(test_database_url):
    database = Database(test_database_url)
    try:
        async for session in database.session():
            assert (await session.execute(text("SELECT 1"))).scalar_one() == 1
    finally:
        await database.dispose()
