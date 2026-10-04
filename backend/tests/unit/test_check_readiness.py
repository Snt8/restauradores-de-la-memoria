import asyncio

import pytest

from app.application.health import CheckReadiness
from app.domain.health import ComponentStatus

pytestmark = pytest.mark.unit


class FakeProbe:
    def __init__(self, result: bool = True, delay: float = 0) -> None:
        self._result = result
        self._delay = delay

    async def ping(self) -> bool:
        await asyncio.sleep(self._delay)
        return self._result


async def test_reporta_listo_cuando_la_base_de_datos_responde():
    report = await CheckReadiness(FakeProbe(result=True), timeout_seconds=1).execute()

    assert report.database is ComponentStatus.UP
    assert report.is_ready


async def test_reporta_no_listo_cuando_la_base_de_datos_falla():
    report = await CheckReadiness(FakeProbe(result=False), timeout_seconds=1).execute()

    assert report.database is ComponentStatus.DOWN
    assert not report.is_ready


async def test_reporta_no_listo_cuando_la_comprobacion_excede_el_tiempo_limite():
    report = await CheckReadiness(FakeProbe(delay=0.5), timeout_seconds=0.05).execute()

    assert report.database is ComponentStatus.DOWN
