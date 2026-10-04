import pytest
from alembic import command

from tests.conftest import alembic_config_para

pytestmark = pytest.mark.integration


@pytest.fixture
def alembic_config(test_database_url):
    return alembic_config_para(test_database_url)


def test_las_migraciones_suben_y_bajan_sin_errores(alembic_config):
    command.upgrade(alembic_config, "head")
    command.downgrade(alembic_config, "base")
    command.upgrade(alembic_config, "head")


def test_los_modelos_no_tienen_cambios_sin_migrar(alembic_config):
    command.upgrade(alembic_config, "head")
    command.check(alembic_config)
