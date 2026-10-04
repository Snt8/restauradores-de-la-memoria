"""Evidencias: fotografías, videos, audios, enlaces y documentos que respaldan el contenido."""

from dataclasses import dataclass
from enum import StrEnum

from app.domain.shared import FechaParcial


class TipoEvidencia(StrEnum):
    FOTO = "foto"
    VIDEO = "video"
    AUDIO = "audio"
    ENLACE = "enlace"
    DOCUMENTO = "documento"


class SeccionEvidencia(StrEnum):
    """Sección del portal a la que pertenece una evidencia según el contenido que respalda."""

    MUSEO = "museo"
    SALIDAS = "salidas"
    CONMEMORACIONES = "conmemoraciones"
    FORMACION = "formacion"
    EVENTOS = "eventos"
    RECONOCIMIENTOS = "reconocimientos"
    ALIANZAS = "alianzas"
    ARCHIVO = "archivo"


@dataclass(frozen=True, slots=True)
class Evidencia:
    id: int
    tipo: TipoEvidencia
    url: str
    titulo: str
    descripcion: str | None
    fecha: FechaParcial
    creditos: str | None


@dataclass(frozen=True, slots=True)
class ElementoGaleria:
    """Evidencia vista desde la galería: incluye su sección y el contenido al que pertenece."""

    evidencia: Evidencia
    seccion: SeccionEvidencia
    contexto: str | None


@dataclass(frozen=True, slots=True)
class FiltrosGaleria:
    tipo: TipoEvidencia | None = None
    seccion: SeccionEvidencia | None = None
