"""Actividades del proyecto: salidas pedagógicas, fechas conmemorativas y formación."""

from dataclasses import dataclass
from enum import StrEnum

from app.domain.evidencias import Evidencia
from app.domain.shared import FechaParcial


class TipoActividad(StrEnum):
    SALIDA_PEDAGOGICA = "salida_pedagogica"
    FECHA_CONMEMORATIVA = "fecha_conmemorativa"
    FORMACION = "formacion"


@dataclass(frozen=True, slots=True)
class Actividad:
    id: int
    slug: str
    nombre: str
    tipo: TipoActividad
    fecha: FechaParcial
    lugar: str | None
    descripcion: str | None
    evidencias: tuple[Evidencia, ...]


@dataclass(frozen=True, slots=True)
class FiltrosActividades:
    tipo: TipoActividad | None = None
    anio: int | None = None
