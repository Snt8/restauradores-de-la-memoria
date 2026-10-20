"""Foro de la comunidad: publicaciones por categoría, comentarios en hilo y votos anónimos."""

from dataclasses import dataclass
from datetime import datetime
from enum import IntEnum, StrEnum
from typing import Protocol
from uuid import UUID

from app.domain.shared import ErrorDeDominio, Pagina, Paginacion

LONGITUD_AUTOR = 60
LONGITUD_TITULO = 200


class CategoriaForo(StrEnum):
    GENERAL = "general"
    MUSEO = "museo"
    SALIDAS = "salidas"
    HISTORIAS = "historias"
    PREGUNTAS = "preguntas"


class OrdenForo(StrEnum):
    """Populares pondera votos, comentarios y antigüedad; mejores ordena solo por votos."""

    POPULARES = "populares"
    RECIENTES = "recientes"
    MEJORES = "mejores"


class ValorVoto(IntEnum):
    EN_CONTRA = -1
    SIN_VOTO = 0
    A_FAVOR = 1


class ObjetivoVoto(StrEnum):
    PUBLICACION = "publicacion"
    COMENTARIO = "comentario"


class TextoVacio(ErrorDeDominio):
    def __init__(self, campo: str) -> None:
        super().__init__(f"El campo '{campo}' no puede quedar vacío.")


class ComentarioDeOtraPublicacion(ErrorDeDominio):
    def __init__(self) -> None:
        super().__init__("Solo puedes responder a comentarios de la misma publicación.")


def _exigir_texto(**campos: str) -> None:
    for campo, valor in campos.items():
        if not valor.strip():
            raise TextoVacio(campo)


@dataclass(frozen=True, slots=True)
class NuevaPublicacion:
    categoria: CategoriaForo
    titulo: str
    contenido: str
    autor: str

    def __post_init__(self) -> None:
        _exigir_texto(titulo=self.titulo, contenido=self.contenido, autor=self.autor)


@dataclass(frozen=True, slots=True)
class NuevoComentario:
    publicacion_id: int
    contenido: str
    autor: str
    padre_id: int | None = None

    def __post_init__(self) -> None:
        _exigir_texto(contenido=self.contenido, autor=self.autor)


@dataclass(frozen=True, slots=True)
class Publicacion:
    id: int
    categoria: CategoriaForo
    titulo: str
    contenido: str
    autor: str
    creado_en: datetime
    puntaje: int
    comentarios: int
    # Voto de quien consulta (si se identificó con su id de votante): -1, 0 o 1.
    mi_voto: ValorVoto = ValorVoto.SIN_VOTO


@dataclass(frozen=True, slots=True)
class Comentario:
    id: int
    publicacion_id: int
    padre_id: int | None
    contenido: str
    autor: str
    creado_en: datetime
    puntaje: int
    mi_voto: ValorVoto = ValorVoto.SIN_VOTO


@dataclass(frozen=True, slots=True)
class FiltrosForo:
    categoria: CategoriaForo | None = None
    orden: OrdenForo = OrdenForo.POPULARES
    votante: UUID | None = None


@dataclass(frozen=True, slots=True)
class Voto:
    """Un votante tiene a lo sumo un voto por elemento; votar SIN_VOTO lo retira."""

    objetivo: ObjetivoVoto
    objetivo_id: int
    votante: UUID
    valor: ValorVoto


@dataclass(frozen=True, slots=True)
class ResultadoVoto:
    puntaje: int
    mi_voto: ValorVoto


class RepositorioForo(Protocol):
    async def listar(self, filtros: FiltrosForo, paginacion: Paginacion) -> Pagina[Publicacion]: ...

    async def obtener(self, publicacion_id: int, votante: UUID | None) -> Publicacion | None: ...

    async def publicar(self, publicacion: NuevaPublicacion) -> Publicacion: ...

    async def comentarios(
        self, publicacion_id: int, votante: UUID | None
    ) -> tuple[Comentario, ...]: ...

    async def publicacion_de_comentario(self, comentario_id: int) -> int | None: ...

    async def comentar(self, comentario: NuevoComentario) -> Comentario: ...

    async def votar(self, voto: Voto) -> ResultadoVoto | None:
        """Registra el voto y devuelve el puntaje nuevo, o None si el objetivo no existe."""
        ...
