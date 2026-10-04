"""Visitas, eventos y apariciones en medios del proyecto."""

from dataclasses import dataclass
from enum import StrEnum

from app.domain.evidencias import Evidencia
from app.domain.shared import FechaParcial


class TipoEvento(StrEnum):
    VISITA = "visita"
    EVENTO = "evento"
    MEDIOS = "medios"


@dataclass(frozen=True, slots=True)
class Evento:
    id: int
    slug: str
    nombre: str
    tipo: TipoEvento
    fecha: FechaParcial
    lugar: str | None
    descripcion: str | None
    evidencias: tuple[Evidencia, ...]


@dataclass(frozen=True, slots=True)
class FiltrosEventos:
    tipo: TipoEvento | None = None
    anio: int | None = None
