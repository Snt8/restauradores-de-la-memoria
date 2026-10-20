"""Foro de la comunidad: muro de publicaciones, comentarios en hilo y votos."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.foro import (
    Comentar,
    ListarComentarios,
    ListarPublicaciones,
    ObtenerPublicacion,
    Publicar,
    Votar,
)
from app.domain.foro import CategoriaForo, FiltrosForo, ObjetivoVoto, OrdenForo, Voto
from app.infrastructure.repositories.foro import RepositorioForoSqlAlchemy
from app.presentation.api.dependencies import PaginacionDep, get_repositorio_foro
from app.presentation.api.v1.schemas.comunes import PaginaSchema
from app.presentation.api.v1.schemas.foro import (
    ComentarioEntrada,
    ComentarioSchema,
    PublicacionEntrada,
    PublicacionSchema,
    ResultadoVotoSchema,
    VotoEntrada,
)

router = APIRouter(prefix="/foro", tags=["foro"])

RepositorioDep = Annotated[RepositorioForoSqlAlchemy, Depends(get_repositorio_foro)]
VotanteQuery = Annotated[
    UUID | None, Query(description="Id anónimo del navegador, para devolver su propio voto")
]
RESPUESTA_404 = {status.HTTP_404_NOT_FOUND: {"description": "La publicación no existe"}}


def filtros_foro(
    categoria: CategoriaForo | None = None,
    orden: OrdenForo = OrdenForo.POPULARES,
    votante: VotanteQuery = None,
) -> FiltrosForo:
    return FiltrosForo(categoria=categoria, orden=orden, votante=votante)


@router.get(
    "/publicaciones",
    response_model=PaginaSchema[PublicacionSchema],
    summary="Lista las publicaciones del foro",
)
async def listar_publicaciones(
    repositorio: RepositorioDep,
    filtros: Annotated[FiltrosForo, Depends(filtros_foro)],
    paginacion: PaginacionDep,
) -> PaginaSchema[PublicacionSchema]:
    pagina = await ListarPublicaciones(repositorio).ejecutar(filtros, paginacion)
    return PaginaSchema[PublicacionSchema].desde(pagina)


@router.post(
    "/publicaciones",
    response_model=PublicacionSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Crea una publicación",
)
async def publicar(entrada: PublicacionEntrada, repositorio: RepositorioDep) -> PublicacionSchema:
    publicacion = await Publicar(repositorio).ejecutar(entrada.a_dominio())
    return PublicacionSchema.model_validate(publicacion)


@router.get(
    "/publicaciones/{publicacion_id}",
    response_model=PublicacionSchema,
    summary="Detalle de una publicación",
    responses=RESPUESTA_404,
)
async def obtener_publicacion(
    publicacion_id: int, repositorio: RepositorioDep, votante: VotanteQuery = None
) -> PublicacionSchema:
    publicacion = await ObtenerPublicacion(repositorio).ejecutar(publicacion_id, votante)
    return PublicacionSchema.model_validate(publicacion)


@router.get(
    "/publicaciones/{publicacion_id}/comentarios",
    response_model=list[ComentarioSchema],
    summary="Todos los comentarios de una publicación, en orden cronológico",
    responses=RESPUESTA_404,
)
async def listar_comentarios(
    publicacion_id: int, repositorio: RepositorioDep, votante: VotanteQuery = None
) -> list[ComentarioSchema]:
    comentarios = await ListarComentarios(repositorio).ejecutar(publicacion_id, votante)
    return [ComentarioSchema.model_validate(comentario) for comentario in comentarios]


@router.post(
    "/publicaciones/{publicacion_id}/comentarios",
    response_model=ComentarioSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Comenta una publicación o responde a otro comentario",
    responses=RESPUESTA_404,
)
async def comentar(
    publicacion_id: int, entrada: ComentarioEntrada, repositorio: RepositorioDep
) -> ComentarioSchema:
    comentario = await Comentar(repositorio).ejecutar(entrada.a_dominio(publicacion_id))
    return ComentarioSchema.model_validate(comentario)


async def _votar(
    objetivo: ObjetivoVoto, objetivo_id: int, entrada: VotoEntrada, repositorio: RepositorioDep
) -> ResultadoVotoSchema:
    voto = Voto(
        objetivo=objetivo, objetivo_id=objetivo_id, votante=entrada.votante, valor=entrada.valor
    )
    return ResultadoVotoSchema.model_validate(await Votar(repositorio).ejecutar(voto))


@router.put(
    "/publicaciones/{publicacion_id}/voto",
    response_model=ResultadoVotoSchema,
    summary="Fija (o retira con 0) el voto de un visitante en una publicación",
    responses=RESPUESTA_404,
)
async def votar_publicacion(
    publicacion_id: int, entrada: VotoEntrada, repositorio: RepositorioDep
) -> ResultadoVotoSchema:
    return await _votar(ObjetivoVoto.PUBLICACION, publicacion_id, entrada, repositorio)


@router.put(
    "/comentarios/{comentario_id}/voto",
    response_model=ResultadoVotoSchema,
    summary="Fija (o retira con 0) el voto de un visitante en un comentario",
    responses={status.HTTP_404_NOT_FOUND: {"description": "El comentario no existe"}},
)
async def votar_comentario(
    comentario_id: int, entrada: VotoEntrada, repositorio: RepositorioDep
) -> ResultadoVotoSchema:
    return await _votar(ObjetivoVoto.COMENTARIO, comentario_id, entrada, repositorio)
