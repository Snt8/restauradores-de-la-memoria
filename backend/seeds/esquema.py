"""Formato de los archivos de contenido inicial: validarlos evita cargar datos inconsistentes."""

from typing import Annotated, Any, ClassVar, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.domain.actividades import TipoActividad
from app.domain.eventos import TipoEvento
from app.domain.evidencias import TipoEvidencia
from app.domain.shared import FechaParcial

Slug = Annotated[str, Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=120)]
TextoCorto = Annotated[str, Field(min_length=1, max_length=200)]


class Semilla(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class FechaSemilla(Semilla):
    anio: int | None = None
    mes: int | None = None
    dia: int | None = None

    @model_validator(mode="after")
    def validar_combinacion(self) -> Self:
        FechaParcial(anio=self.anio, mes=self.mes, dia=self.dia)  # lanza si no es coherente
        return self


class EvidenciaSemilla(Semilla):
    tipo: TipoEvidencia
    url: Annotated[str, Field(min_length=1, max_length=500)]
    titulo: TextoCorto
    descripcion: str | None = None
    fecha: FechaSemilla = FechaSemilla()
    creditos: str | None = None


class ContenidoSemilla(Semilla):
    """Base de todo lo que se identifica por slug y puede tener evidencias."""

    slug: Slug
    nombre: TextoCorto
    evidencias: list[EvidenciaSemilla] = []

    # Campos que no son columnas directas del modelo ORM.
    NO_COLUMNAS: ClassVar[frozenset[str]] = frozenset({"slug", "evidencias", "fecha"})

    def columnas(self) -> dict[str, Any]:
        """Valores de las columnas propias, con la fecha parcial expandida en anio/mes/dia."""
        valores = self.model_dump(exclude=set(self.NO_COLUMNAS))
        fecha = getattr(self, "fecha", None)
        if fecha is not None:
            valores.update(fecha.model_dump())
        return valores


class ExposicionSemilla(ContenidoSemilla):
    descripcion: str | None = None
    lugar: str | None = None
    fecha: FechaSemilla = FechaSemilla()


class UbicacionSemilla(Semilla):
    x: float = 0
    y: float = 0
    z: float = 0
    rotacion_y: float = 0
    escala: Annotated[float, Field(gt=0)] = 1


class ObjetoMuseoSemilla(ContenidoSemilla):
    descripcion: str
    importancia_memoria: str | None = None
    foto_url: str | None = None
    modelo_3d_url: str | None = None
    creditos: str | None = None
    fecha: FechaSemilla = FechaSemilla()
    ubicacion: UbicacionSemilla = UbicacionSemilla()
    orden: int = 0
    exposiciones: list[Slug] = []

    NO_COLUMNAS: ClassVar[frozenset[str]] = frozenset(
        {"slug", "evidencias", "fecha", "ubicacion", "exposiciones"}
    )

    def columnas(self) -> dict[str, Any]:
        u = self.ubicacion
        return {
            **super().columnas(),
            "pos_x": u.x,
            "pos_y": u.y,
            "pos_z": u.z,
            "rot_y": u.rotacion_y,
            "escala": u.escala,
        }


class EventoSemilla(ContenidoSemilla):
    tipo: TipoEvento
    fecha: FechaSemilla = FechaSemilla()
    lugar: str | None = None
    descripcion: str | None = None


class ActividadSemilla(ContenidoSemilla):
    tipo: TipoActividad
    fecha: FechaSemilla = FechaSemilla()
    lugar: str | None = None
    descripcion: str | None = None


class ReconocimientoSemilla(ContenidoSemilla):
    otorgante: str | None = None
    fecha: FechaSemilla = FechaSemilla()
    descripcion: str | None = None


class AliadoSemilla(ContenidoSemilla):
    tipo: str | None = None
    descripcion: str | None = None
    logo_url: str | None = None
    sitio_web: str | None = None


class ArchivoDeSemillas[T: BaseModel](Semilla):
    """
    Un archivo JSON de contenido. `creditos_por_defecto` evita repetir el mismo crédito
    en cada evidencia: se aplica a las que no declaran uno propio.
    """

    creditos_por_defecto: str | None = None
    elementos: list[T]

    @model_validator(mode="after")
    def slugs_unicos(self) -> Self:
        slugs = [getattr(elemento, "slug", None) for elemento in self.elementos]
        repetidos = {slug for slug in slugs if slug is not None and slugs.count(slug) > 1}
        if repetidos:
            raise ValueError(f"Slugs repetidos: {', '.join(sorted(repetidos))}")
        return self

    def evidencias_de(self, evidencias: list[EvidenciaSemilla]) -> list[EvidenciaSemilla]:
        return [
            evidencia.model_copy(
                update={"creditos": evidencia.creditos or self.creditos_por_defecto}
            )
            for evidencia in evidencias
        ]
