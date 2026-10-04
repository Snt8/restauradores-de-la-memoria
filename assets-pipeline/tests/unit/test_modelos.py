import math

import pytest

from media_pipeline.modelos import (
    MODELOS_PROVISIONALES,
    Malla,
    caja,
    escribir_glb,
    torno,
)
from tests.glb import leer_glb, leer_indices

pytestmark = pytest.mark.unit

ROJO = (1.0, 0.0, 0.0)


def test_la_caja_tiene_cuatro_vertices_y_dos_triangulos_por_cara():
    malla = caja("c", 2, 1, 4, ROJO, origen=(10.0, 5.0, 0.0))

    assert len(malla.posiciones) == 24
    assert len(malla.indices) == 36
    xs = [x for x, _, _ in malla.posiciones]
    ys = [y for _, y, _ in malla.posiciones]
    assert (min(xs), max(xs)) == (9, 11)
    assert (min(ys), max(ys)) == (5, 6)


def test_el_torno_genera_anillos_cerrados_con_normales_unitarias():
    perfil = [(0.0, 0.0), (1.0, 0.0), (1.0, 2.0)]

    malla = torno("t", perfil, segmentos=8, color=ROJO)

    assert len(malla.posiciones) == (8 + 1) * 3
    assert len(malla.indices) == 8 * 2 * 6
    for normal in malla.normales:
        assert math.isclose(math.hypot(*normal), 1.0, rel_tol=1e-9)
    # La pared vertical (radio 1) en el ángulo 0 apunta hacia +x.
    assert malla.normales[2] == pytest.approx((1.0, 0.0, 0.0))


def test_el_torno_exige_segmentos_y_perfil_suficientes():
    with pytest.raises(ValueError):
        torno("t", [(1.0, 0.0), (1.0, 1.0)], segmentos=2, color=ROJO)
    with pytest.raises(ValueError):
        torno("t", [(1.0, 0.0)], segmentos=8, color=ROJO)


@pytest.mark.parametrize(
    ("posiciones", "normales", "indices"),
    [
        (((0, 0, 0),), (), ()),
        (((0, 0, 0),), ((0, 1, 0),), (0, 0)),
        (((0, 0, 0),), ((0, 1, 0),), (0, 0, 1)),
    ],
)
def test_la_malla_valida_su_consistencia(posiciones, normales, indices):
    with pytest.raises(ValueError):
        Malla("m", posiciones, normales, indices, ROJO)


def test_escribe_un_glb_valido_con_un_nodo_y_un_material_por_malla():
    mallas = [caja("a", 1, 1, 1, ROJO), caja("b", 1, 1, 1, (0.0, 0.0, 1.0))]

    documento, binario = leer_glb(escribir_glb(mallas))

    assert documento["asset"]["version"] == "2.0"
    assert [nodo["name"] for nodo in documento["nodes"]] == ["a", "b"]
    assert len(documento["materials"]) == 2
    assert documento["buffers"][0]["byteLength"] == len(binario)
    for vista in documento["bufferViews"]:
        assert vista["byteOffset"] % 4 == 0
        assert vista["byteOffset"] + vista["byteLength"] <= len(binario)

    primitiva = documento["meshes"][0]["primitives"][0]
    posicion = documento["accessors"][primitiva["attributes"]["POSITION"]]
    assert posicion["count"] == 24
    assert posicion["min"] == [-0.5, 0.0, -0.5]
    assert posicion["max"] == [0.5, 1.0, 0.5]
    assert max(leer_indices(documento, binario, primitiva["indices"])) < posicion["count"]


def test_los_modelos_provisionales_se_construyen_sin_errores():
    for construir in MODELOS_PROVISIONALES.values():
        documento, _ = leer_glb(escribir_glb(construir()))
        assert documento["meshes"]
