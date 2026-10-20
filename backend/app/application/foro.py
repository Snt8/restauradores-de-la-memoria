"""Casos de uso del foro: leer el muro, publicar, comentar en hilo y votar."""

from uuid import UUID

from app.domain.foro import (
    Comentario,
    ComentarioDeOtraPublicacion,
    FiltrosForo,
    NuevaPublicacion,
    NuevoComentario,
    ObjetivoVoto,
    Publicacion,
    RepositorioForo,
    ResultadoVoto,
    Voto,
)
from app.domain.shared import EntidadNoEncontrada, Pagina, Paginacion

PUBLICACIONES = "publicaciones del foro"
COMENTARIOS = "comentarios del foro"


class _CasoDeUsoForo:
    def __init__(self, repositorio: RepositorioForo) -> None:
        self._repositorio = repositorio

    async def _publicacion(self, publicacion_id: int, votante: UUID | None) -> Publicacion:
        publicacion = await self._repositorio.obtener(publicacion_id, votante)
        if publicacion is None:
            raise EntidadNoEncontrada(PUBLICACIONES, str(publicacion_id))
        return publicacion


class ListarPublicaciones(_CasoDeUsoForo):
    async def ejecutar(self, filtros: FiltrosForo, paginacion: Paginacion) -> Pagina[Publicacion]:
        return await self._repositorio.listar(filtros, paginacion)


class ObtenerPublicacion(_CasoDeUsoForo):
    async def ejecutar(self, publicacion_id: int, votante: UUID | None = None) -> Publicacion:
        return await self._publicacion(publicacion_id, votante)


class Publicar(_CasoDeUsoForo):
    async def ejecutar(self, publicacion: NuevaPublicacion) -> Publicacion:
        return await self._repositorio.publicar(publicacion)


class ListarComentarios(_CasoDeUsoForo):
    async def ejecutar(
        self, publicacion_id: int, votante: UUID | None = None
    ) -> tuple[Comentario, ...]:
        await self._publicacion(publicacion_id, None)
        return await self._repositorio.comentarios(publicacion_id, votante)


class Comentar(_CasoDeUsoForo):
    async def ejecutar(self, comentario: NuevoComentario) -> Comentario:
        await self._publicacion(comentario.publicacion_id, None)
        if comentario.padre_id is not None:
            publicacion_del_padre = await self._repositorio.publicacion_de_comentario(
                comentario.padre_id
            )
            if publicacion_del_padre is None:
                raise EntidadNoEncontrada(COMENTARIOS, str(comentario.padre_id))
            if publicacion_del_padre != comentario.publicacion_id:
                raise ComentarioDeOtraPublicacion
        return await self._repositorio.comentar(comentario)


class Votar(_CasoDeUsoForo):
    async def ejecutar(self, voto: Voto) -> ResultadoVoto:
        resultado = await self._repositorio.votar(voto)
        if resultado is None:
            entidad = PUBLICACIONES if voto.objetivo is ObjetivoVoto.PUBLICACION else COMENTARIOS
            raise EntidadNoEncontrada(entidad, str(voto.objetivo_id))
        return resultado
