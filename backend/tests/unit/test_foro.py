from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.application.foro import Comentar, ListarComentarios, ObtenerPublicacion, Votar
from app.domain.foro import (
    CategoriaForo,
    Comentario,
    ComentarioDeOtraPublicacion,
    NuevaPublicacion,
    NuevoComentario,
    ObjetivoVoto,
    Publicacion,
    ResultadoVoto,
    TextoVacio,
    ValorVoto,
    Voto,
)
from app.domain.shared import EntidadNoEncontrada

pytestmark = pytest.mark.unit

AHORA = datetime.now(UTC)


def publicacion(publicacion_id: int) -> Publicacion:
    return Publicacion(
        id=publicacion_id,
        categoria=CategoriaForo.GENERAL,
        titulo="Hola",
        contenido="Texto",
        autor="Ana",
        creado_en=AHORA,
        puntaje=0,
        comentarios=0,
    )


class RepositorioForoFalso:
    """Dos publicaciones (1 y 2); el comentario 10 pertenece a la publicación 2."""

    def __init__(self) -> None:
        self.publicaciones = {1: publicacion(1), 2: publicacion(2)}
        self.comentarios_por_publicacion = {10: 2}
        self.guardados: list[NuevoComentario] = []

    async def obtener(self, publicacion_id, votante):
        return self.publicaciones.get(publicacion_id)

    async def comentarios(self, publicacion_id, votante):
        return ()

    async def publicacion_de_comentario(self, comentario_id):
        return self.comentarios_por_publicacion.get(comentario_id)

    async def comentar(self, comentario):
        self.guardados.append(comentario)
        return Comentario(
            id=99,
            publicacion_id=comentario.publicacion_id,
            padre_id=comentario.padre_id,
            contenido=comentario.contenido,
            autor=comentario.autor,
            creado_en=AHORA,
            puntaje=0,
        )

    async def votar(self, voto):
        existe = (
            voto.objetivo_id in self.publicaciones
            if voto.objetivo is ObjetivoVoto.PUBLICACION
            else voto.objetivo_id in self.comentarios_por_publicacion
        )
        return ResultadoVoto(puntaje=int(voto.valor), mi_voto=voto.valor) if existe else None


@pytest.mark.parametrize(
    ("campos", "campo_vacio"),
    [({"titulo": "  "}, "titulo"), ({"contenido": "\n"}, "contenido"), ({"autor": ""}, "autor")],
)
def test_una_publicacion_no_admite_textos_vacios(campos, campo_vacio):
    datos = {"categoria": CategoriaForo.MUSEO, "titulo": "T", "contenido": "C", "autor": "A"}

    with pytest.raises(TextoVacio, match=campo_vacio):
        NuevaPublicacion(**{**datos, **campos})


def test_un_comentario_no_admite_contenido_vacio():
    with pytest.raises(TextoVacio, match="contenido"):
        NuevoComentario(publicacion_id=1, contenido="   ", autor="Ana")


async def test_obtener_una_publicacion_inexistente_es_un_error():
    with pytest.raises(EntidadNoEncontrada, match="'7' en publicaciones del foro"):
        await ObtenerPublicacion(RepositorioForoFalso()).ejecutar(7)


async def test_no_se_listan_comentarios_de_una_publicacion_inexistente():
    with pytest.raises(EntidadNoEncontrada):
        await ListarComentarios(RepositorioForoFalso()).ejecutar(7)


async def test_comentar_guarda_respuestas_dentro_de_la_misma_publicacion():
    repositorio = RepositorioForoFalso()
    respuesta = NuevoComentario(publicacion_id=2, contenido="De acuerdo", autor="Luis", padre_id=10)

    comentario = await Comentar(repositorio).ejecutar(respuesta)

    assert comentario.padre_id == 10
    assert repositorio.guardados == [respuesta]


async def test_no_se_puede_responder_un_comentario_de_otra_publicacion():
    repositorio = RepositorioForoFalso()
    respuesta = NuevoComentario(publicacion_id=1, contenido="Hola", autor="Luis", padre_id=10)

    with pytest.raises(ComentarioDeOtraPublicacion):
        await Comentar(repositorio).ejecutar(respuesta)
    assert repositorio.guardados == []


async def test_no_se_puede_responder_un_comentario_inexistente():
    respuesta = NuevoComentario(publicacion_id=1, contenido="Hola", autor="Luis", padre_id=55)

    with pytest.raises(EntidadNoEncontrada, match="comentarios del foro"):
        await Comentar(RepositorioForoFalso()).ejecutar(respuesta)


@pytest.mark.parametrize(
    ("objetivo", "entidad"),
    [
        (ObjetivoVoto.PUBLICACION, "publicaciones del foro"),
        (ObjetivoVoto.COMENTARIO, "comentarios del foro"),
    ],
)
async def test_votar_un_elemento_inexistente_es_un_error(objetivo, entidad):
    voto = Voto(objetivo=objetivo, objetivo_id=404, votante=uuid4(), valor=ValorVoto.A_FAVOR)

    with pytest.raises(EntidadNoEncontrada, match=entidad):
        await Votar(RepositorioForoFalso()).ejecutar(voto)


async def test_votar_devuelve_el_puntaje_nuevo():
    voto = Voto(
        objetivo=ObjetivoVoto.PUBLICACION, objetivo_id=1, votante=uuid4(), valor=ValorVoto.A_FAVOR
    )

    assert await Votar(RepositorioForoFalso()).ejecutar(voto) == ResultadoVoto(
        puntaje=1, mi_voto=ValorVoto.A_FAVOR
    )
