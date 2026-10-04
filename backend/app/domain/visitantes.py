"""Visitantes: personas que escriben por el formulario de contacto o firman el libro de visitas."""

from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from typing import Protocol

from app.domain.shared import ErrorDeDominio


class OrigenVisitante(StrEnum):
    CONTACTO = "contacto"
    LIBRO_VISITAS = "libro_visitas"


class ConsentimientoRequerido(ErrorDeDominio):
    """Ley 1581 de 2012 (habeas data): sin autorización no se guardan datos personales."""

    def __init__(self) -> None:
        super().__init__("Se requiere la autorización para el tratamiento de datos personales.")


class MensajeRequerido(ErrorDeDominio):
    def __init__(self) -> None:
        super().__init__("El formulario de contacto requiere un mensaje.")


@dataclass(frozen=True, slots=True)
class NuevoVisitante:
    nombre: str
    correo: str
    origen: OrigenVisitante
    consentimiento_datos: bool
    institucion: str | None = None
    rol: str | None = None
    mensaje: str | None = None

    def __post_init__(self) -> None:
        if not self.consentimiento_datos:
            raise ConsentimientoRequerido
        if self.origen is OrigenVisitante.CONTACTO and not (self.mensaje or "").strip():
            raise MensajeRequerido


@dataclass(frozen=True, slots=True)
class VisitanteRegistrado:
    id: int
    creado_en: datetime


class RepositorioVisitantes(Protocol):
    async def registrar(self, visitante: NuevoVisitante) -> VisitanteRegistrado: ...
