"""Reconocimientos obtenidos por el proyecto o sus participantes."""

from dataclasses import dataclass

from app.domain.evidencias import Evidencia
from app.domain.shared import FechaParcial


@dataclass(frozen=True, slots=True)
class Reconocimiento:
    id: int
    slug: str
    nombre: str
    otorgante: str | None
    fecha: FechaParcial
    descripcion: str | None
    evidencias: tuple[Evidencia, ...]
