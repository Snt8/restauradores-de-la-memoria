from datetime import UTC, datetime

import pytest

from app.application.contenido import ListarContenido, ObtenerContenido
from app.application.visitantes import RegistrarVisitante
from app.domain.shared import EntidadNoEncontrada, Pagina, Paginacion, SinFiltros
from app.domain.visitantes import (
    ConsentimientoRequerido,
    MensajeRequerido,
    NuevoVisitante,
    OrigenVisitante,
    VisitanteRegistrado,
)

pytestmark = pytest.mark.unit


class RepositorioEnMemoria:
    def __init__(self, elementos: dict[str, str]) -> None:
        self.elementos = elementos
        self.consultas: list[tuple[object, Paginacion]] = []

    async def listar(self, filtros, paginacion):
        self.consultas.append((filtros, paginacion))
        valores = tuple(self.elementos.values())
        return Pagina(elementos=valores, total=len(valores), paginacion=paginacion)

    async def obtener(self, slug):
        return self.elementos.get(slug)


class RepositorioVisitantesFalso:
    def __init__(self) -> None:
        self.registrados: list[NuevoVisitante] = []

    async def registrar(self, visitante):
        self.registrados.append(visitante)
        return VisitanteRegistrado(id=len(self.registrados), creado_en=datetime.now(UTC))


async def test_listar_contenido_delega_filtros_y_paginacion_al_repositorio():
    repositorio = RepositorioEnMemoria({"a": "Elemento A"})
    paginacion = Paginacion(limite=10)

    pagina = await ListarContenido(repositorio).ejecutar(SinFiltros(), paginacion)

    assert pagina.elementos == ("Elemento A",)
    assert repositorio.consultas == [(SinFiltros(), paginacion)]


async def test_obtener_contenido_devuelve_el_elemento_existente():
    caso = ObtenerContenido(RepositorioEnMemoria({"a": "Elemento A"}), "eventos")

    assert await caso.ejecutar("a") == "Elemento A"


async def test_obtener_contenido_lanza_si_el_slug_no_existe():
    caso = ObtenerContenido(RepositorioEnMemoria({}), "eventos")

    with pytest.raises(EntidadNoEncontrada, match="'x' en eventos"):
        await caso.ejecutar("x")


async def test_registrar_visitante_guarda_al_visitante_valido():
    repositorio = RepositorioVisitantesFalso()
    visitante = NuevoVisitante(
        nombre="Ana",
        correo="ana@example.com",
        origen=OrigenVisitante.CONTACTO,
        consentimiento_datos=True,
        mensaje="Hola",
    )

    registrado = await RegistrarVisitante(repositorio).ejecutar(visitante)

    assert registrado.id == 1
    assert repositorio.registrados == [visitante]


def test_sin_consentimiento_no_se_puede_crear_un_visitante():
    with pytest.raises(ConsentimientoRequerido):
        NuevoVisitante(
            nombre="Ana",
            correo="ana@example.com",
            origen=OrigenVisitante.LIBRO_VISITAS,
            consentimiento_datos=False,
        )


@pytest.mark.parametrize("mensaje", [None, "", "   "])
def test_el_contacto_exige_mensaje(mensaje):
    with pytest.raises(MensajeRequerido):
        NuevoVisitante(
            nombre="Ana",
            correo="ana@example.com",
            origen=OrigenVisitante.CONTACTO,
            consentimiento_datos=True,
            mensaje=mensaje,
        )


def test_el_libro_de_visitas_no_exige_mensaje():
    visitante = NuevoVisitante(
        nombre="Ana",
        correo="ana@example.com",
        origen=OrigenVisitante.LIBRO_VISITAS,
        consentimiento_datos=True,
    )

    assert visitante.mensaje is None
