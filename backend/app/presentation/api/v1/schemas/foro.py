from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domain.foro import (
    LONGITUD_AUTOR,
    LONGITUD_TITULO,
    CategoriaForo,
    NuevaPublicacion,
    NuevoComentario,
    ValorVoto,
)
from app.presentation.api.v1.schemas.comunes import EsquemaDeDominio

Autor = Annotated[str, Field(min_length=2, max_length=LONGITUD_AUTOR)]


class _Entrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")


class PublicacionEntrada(_Entrada):
    categoria: CategoriaForo
    titulo: Annotated[str, Field(min_length=5, max_length=LONGITUD_TITULO)]
    contenido: Annotated[str, Field(min_length=1, max_length=10_000)]
    autor: Autor

    def a_dominio(self) -> NuevaPublicacion:
        return NuevaPublicacion(**self.model_dump())


class ComentarioEntrada(_Entrada):
    contenido: Annotated[str, Field(min_length=1, max_length=5_000)]
    autor: Autor
    padre_id: Annotated[int | None, Field(ge=1)] = None

    def a_dominio(self, publicacion_id: int) -> NuevoComentario:
        return NuevoComentario(publicacion_id=publicacion_id, **self.model_dump())


class VotoEntrada(_Entrada):
    votante: UUID
    valor: ValorVoto


class PublicacionSchema(EsquemaDeDominio):
    id: int
    categoria: CategoriaForo
    titulo: str
    contenido: str
    autor: str
    creado_en: datetime
    puntaje: int
    comentarios: int
    mi_voto: ValorVoto


class ComentarioSchema(EsquemaDeDominio):
    id: int
    publicacion_id: int
    padre_id: int | None
    contenido: str
    autor: str
    creado_en: datetime
    puntaje: int
    mi_voto: ValorVoto


class ResultadoVotoSchema(EsquemaDeDominio):
    puntaje: int
    mi_voto: ValorVoto
