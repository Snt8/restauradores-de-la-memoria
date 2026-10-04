from pathlib import Path

import pytest

from media_pipeline.catalogo import CatalogoInvalido, cargar_catalogo, parsear_catalogo

pytestmark = pytest.mark.unit

CATALOGO_REAL = Path(__file__).resolve().parents[2] / "catalogo.json"


def catalogo(**cambios) -> dict:
    datos = {
        "fuentes": {"presentacion": "p.pptx"},
        "tamanos": {"sm": 480, "lg": 1280},
        "calidad": 72,
        "imagenes": [
            {"fuente": "presentacion", "miembro": "ppt/media/a.png", "destino": "museo/pieza-1"}
        ],
    }
    datos.update(cambios)
    return datos


def test_parsea_un_catalogo_valido_con_valores_por_defecto():
    resultado = parsear_catalogo(catalogo())

    assert resultado.calidad == 72
    assert resultado.tamanos == {"sm": 480, "lg": 1280}
    (imagen,) = resultado.imagenes
    assert imagen.destino == "museo/pieza-1"
    assert imagen.recorte is None
    assert imagen.rotacion == 0


@pytest.mark.parametrize(
    ("imagen", "mensaje"),
    [
        ({"fuente": "otra", "miembro": "x", "destino": "a/b"}, "Fuente desconocida"),
        ({"fuente": "presentacion", "miembro": "x", "destino": "Museo/Pieza"}, "Destino inválido"),
        (
            {"fuente": "presentacion", "miembro": "x", "destino": "a/b", "rotacion": 45},
            "Rotación inválida",
        ),
        (
            {"fuente": "presentacion", "miembro": "x", "destino": "a/b", "recorte": [10, 0, 5, 9]},
            "Recorte inválido",
        ),
        (
            {"fuente": "presentacion", "miembro": "x", "destino": "a/b", "recorte": [1, 2, 3]},
            "necesita 4 valores",
        ),
    ],
)
def test_rechaza_entradas_invalidas(imagen, mensaje):
    with pytest.raises(CatalogoInvalido, match=mensaje):
        parsear_catalogo(catalogo(imagenes=[imagen]))


def test_rechaza_destinos_repetidos():
    imagen = {"fuente": "presentacion", "miembro": "x", "destino": "a/b"}

    with pytest.raises(CatalogoInvalido, match="Destinos repetidos: a/b"):
        parsear_catalogo(catalogo(imagenes=[imagen, {**imagen, "miembro": "y"}]))


@pytest.mark.parametrize("calidad", [0, 101])
def test_rechaza_calidades_fuera_de_rango(calidad):
    with pytest.raises(CatalogoInvalido, match="calidad"):
        parsear_catalogo(catalogo(calidad=calidad))


def test_rechaza_tamanos_vacios_o_no_positivos():
    with pytest.raises(CatalogoInvalido):
        parsear_catalogo(catalogo(tamanos={}))
    with pytest.raises(CatalogoInvalido):
        parsear_catalogo(catalogo(tamanos={"sm": 0}))


def test_el_catalogo_del_proyecto_es_valido():
    resultado = cargar_catalogo(CATALOGO_REAL)

    assert len(resultado.imagenes) > 0
    assert set(resultado.tamanos) == {"sm", "lg"}
