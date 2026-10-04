from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config

pytestmark = pytest.mark.integration

BACKEND_ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture
def alembic_config(test_database_url) -> Config:
    config = Config(str(BACKEND_ROOT / "alembic.ini"))
    config.attributes["database_url"] = test_database_url
    config.attributes["configure_logger"] = False
    return config


def test_las_migraciones_suben_y_bajan_sin_errores(alembic_config):
    command.upgrade(alembic_config, "head")
    command.downgrade(alembic_config, "base")
    command.upgrade(alembic_config, "head")


def test_los_modelos_no_tienen_cambios_sin_migrar(alembic_config):
    command.upgrade(alembic_config, "head")
    command.check(alembic_config)
