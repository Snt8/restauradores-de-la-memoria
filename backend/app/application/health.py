"""Caso de uso: determinar si el sistema está listo para atender peticiones."""

import asyncio

from app.domain.health import ComponentStatus, DatabaseProbe, ReadinessReport


class CheckReadiness:
    def __init__(self, database_probe: DatabaseProbe, timeout_seconds: float) -> None:
        self._database_probe = database_probe
        self._timeout_seconds = timeout_seconds

    async def execute(self) -> ReadinessReport:
        try:
            async with asyncio.timeout(self._timeout_seconds):
                database_up = await self._database_probe.ping()
        except TimeoutError:
            database_up = False

        return ReadinessReport(database=ComponentStatus.UP if database_up else ComponentStatus.DOWN)
