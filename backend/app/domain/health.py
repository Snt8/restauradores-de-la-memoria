"""Conceptos de dominio para el estado de salud del sistema."""

from dataclasses import dataclass
from enum import StrEnum
from typing import Protocol


class ComponentStatus(StrEnum):
    UP = "up"
    DOWN = "down"


@dataclass(frozen=True, slots=True)
class ReadinessReport:
    database: ComponentStatus

    @property
    def is_ready(self) -> bool:
        return self.database is ComponentStatus.UP


class DatabaseProbe(Protocol):
    """Puerto: comprueba si la base de datos responde. La infraestructura lo implementa."""

    async def ping(self) -> bool: ...
