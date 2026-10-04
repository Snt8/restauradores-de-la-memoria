"""Esquemas de respuesta de cada colección de contenido."""

from app.domain.actividades import TipoActividad
from app.domain.eventos import TipoEvento
from app.domain.evidencias import SeccionEvidencia
from app.presentation.api.v1.schemas.comunes import (
    EsquemaDeDominio,
    EvidenciaSchema,
    FechaParcialSchema,
)


class ContenidoSchema(EsquemaDeDominio):
    id: int
    slug: str
    nombre: str
    evidencias: list[EvidenciaSchema]


class ExposicionSchema(ContenidoSchema):
    descripcion: str | None
    lugar: str | None
    fecha: FechaParcialSchema


class ReferenciaExposicionSchema(EsquemaDeDominio):
    slug: str
    nombre: str


class UbicacionEnSalaSchema(EsquemaDeDominio):
    x: float
    y: float
    z: float
    rotacion_y: float
    escala: float


class ObjetoMuseoSchema(ContenidoSchema):
    descripcion: str
    importancia_memoria: str | None
    foto_url: str | None
    modelo_3d_url: str | None
    creditos: str | None
    fecha: FechaParcialSchema
    ubicacion: UbicacionEnSalaSchema
    orden: int
    exposiciones: list[ReferenciaExposicionSchema]


class EventoSchema(ContenidoSchema):
    tipo: TipoEvento
    fecha: FechaParcialSchema
    lugar: str | None
    descripcion: str | None


class ActividadSchema(ContenidoSchema):
    tipo: TipoActividad
    fecha: FechaParcialSchema
    lugar: str | None
    descripcion: str | None


class ReconocimientoSchema(ContenidoSchema):
    otorgante: str | None
    fecha: FechaParcialSchema
    descripcion: str | None


class AliadoSchema(ContenidoSchema):
    tipo: str | None
    descripcion: str | None
    logo_url: str | None
    sitio_web: str | None


class ElementoGaleriaSchema(EsquemaDeDominio):
    evidencia: EvidenciaSchema
    seccion: SeccionEvidencia
    contexto: str | None
