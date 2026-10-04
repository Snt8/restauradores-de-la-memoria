"""Esquemas compartidos por todas las respuestas de contenido."""

from typing import Self

from pydantic import BaseModel, ConfigDict

from app.domain.evidencias import TipoEvidencia
from app.domain.shared import Pagina


class EsquemaDeDominio(BaseModel):
    """Base de las respuestas: se construyen leyendo los atributos de las entidades del dominio."""

    model_config = ConfigDict(from_attributes=True)


class FechaParcialSchema(EsquemaDeDominio):
    anio: int | None
    mes: int | None
    dia: int | None


class EvidenciaSchema(EsquemaDeDominio):
    id: int
    tipo: TipoEvidencia
    url: str
    titulo: str
    descripcion: str | None
    fecha: FechaParcialSchema
    creditos: str | None


class PaginaSchema[T](BaseModel):
    elementos: list[T]
    total: int
    limite: int
    desplazamiento: int

    @classmethod
    def desde(cls, pagina: Pagina[object]) -> Self:
        return cls.model_validate(
            {
                "elementos": pagina.elementos,
                "total": pagina.total,
                "limite": pagina.paginacion.limite,
                "desplazamiento": pagina.paginacion.desplazamiento,
            },
            from_attributes=True,
        )
