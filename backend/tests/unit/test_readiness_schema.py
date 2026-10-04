import pytest

from app.domain.health import ComponentStatus, ReadinessReport
from app.presentation.api.v1.schemas.health import ReadinessResponse

pytestmark = pytest.mark.unit


@pytest.mark.parametrize(
    ("database", "expected_status"),
    [(ComponentStatus.UP, "ok"), (ComponentStatus.DOWN, "unavailable")],
)
def test_traduce_el_reporte_de_dominio_a_la_respuesta_http(database, expected_status):
    response = ReadinessResponse.from_report(ReadinessReport(database=database))

    assert response.model_dump(mode="json") == {
        "status": expected_status,
        "database": database.value,
    }
