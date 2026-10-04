import pytest

from app.domain.shared import EntidadNoEncontrada, FechaInvalida, FechaParcial, Paginacion

pytestmark = pytest.mark.unit


@pytest.mark.parametrize(
    "fecha",
    [
        FechaParcial(),
        FechaParcial(anio=2022),
        FechaParcial(anio=2023, mes=10),
        FechaParcial(anio=2025, mes=10, dia=22),
        FechaParcial(mes=4, dia=9),
        FechaParcial(mes=2, dia=29),  # recurrente: se valida contra un año bisiesto
    ],
)
def test_acepta_las_precisiones_que_tienen_las_fuentes(fecha):
    assert isinstance(fecha, FechaParcial)


@pytest.mark.parametrize(
    ("valores", "mensaje"),
    [
        ({"anio": 1800}, "año"),
        ({"anio": 2024, "mes": 13}, "mes"),
        ({"anio": 2024, "dia": 3}, "requiere el mes"),
        ({"anio": 2023, "mes": 2, "dia": 29}, "no tiene día 29"),
        ({"mes": 4}, "no identifica"),
    ],
)
def test_rechaza_combinaciones_incoherentes(valores, mensaje):
    with pytest.raises(FechaInvalida, match=mensaje):
        FechaParcial(**valores)


def test_distingue_fechas_recurrentes_y_por_confirmar():
    assert FechaParcial(mes=4, dia=9).es_recurrente
    assert not FechaParcial(anio=2025, mes=4, dia=9).es_recurrente
    assert FechaParcial().por_confirmar
    assert not FechaParcial(anio=2021).por_confirmar


@pytest.mark.parametrize(("limite", "desplazamiento"), [(0, 0), (101, 0), (10, -1)])
def test_la_paginacion_rechaza_valores_fuera_de_rango(limite, desplazamiento):
    with pytest.raises(ValueError):
        Paginacion(limite=limite, desplazamiento=desplazamiento)


def test_entidad_no_encontrada_explica_que_faltó():
    error = EntidadNoEncontrada("objetos del museo", "pieza-x")

    assert str(error) == "No se encontró 'pieza-x' en objetos del museo."
    assert (error.entidad, error.clave) == ("objetos del museo", "pieza-x")
