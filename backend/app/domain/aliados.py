"""Instituciones y organizaciones aliadas del proyecto."""

from dataclasses import dataclass

from app.domain.evidencias import Evidencia


@dataclass(frozen=True, slots=True)
class Aliado:
    id: int
    slug: str
    nombre: str
    tipo: str | None
    descripcion: str | None
    logo_url: str | None
    sitio_web: str | None
    evidencias: tuple[Evidencia, ...]
