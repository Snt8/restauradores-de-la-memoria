"""Museo Escolar de la Memoria: exposiciones y objetos del museo."""

from dataclasses import dataclass

from app.domain.evidencias import Evidencia
from app.domain.shared import FechaParcial


@dataclass(frozen=True, slots=True)
class Exposicion:
    id: int
    slug: str
    nombre: str
    descripcion: str | None
    lugar: str | None
    fecha: FechaParcial
    evidencias: tuple[Evidencia, ...]


@dataclass(frozen=True, slots=True)
class ReferenciaExposicion:
    slug: str
    nombre: str


@dataclass(frozen=True, slots=True)
class UbicacionEnSala:
    """Posición del objeto en la sala del Museo Virtual (metros y grados, convención de A-Frame)."""

    x: float
    y: float
    z: float
    rotacion_y: float
    escala: float


@dataclass(frozen=True, slots=True)
class ObjetoMuseo:
    id: int
    slug: str
    nombre: str
    descripcion: str
    importancia_memoria: str | None
    foto_url: str | None
    modelo_3d_url: str | None
    creditos: str | None
    fecha: FechaParcial
    ubicacion: UbicacionEnSala
    orden: int
    exposiciones: tuple[ReferenciaExposicion, ...]
    evidencias: tuple[Evidencia, ...]
