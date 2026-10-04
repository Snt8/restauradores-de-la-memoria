import pytest
from pydantic import ValidationError

from app.domain.evidencias import Evidencia, TipoEvidencia
from app.domain.shared import FechaParcial, Pagina, Paginacion
from app.domain.visitantes import ConsentimientoRequerido, OrigenVisitante
from app.presentation.api.v1.schemas.comunes import EvidenciaSchema, PaginaSchema
from app.presentation.api.v1.schemas.visitantes import VisitanteEntrada

pytestmark = pytest.mark.unit

VISITANTE = {
    "nombre": "  Ana Pérez ",
    "correo": "ana@example.com",
    "mensaje": "Quiero visitar el museo",
    "consentimiento_datos": True,
}


def test_la_entrada_de_visitante_limpia_espacios_y_usa_contacto_por_defecto():
    entrada = VisitanteEntrada(**VISITANTE, institucion="   ", rol="")

    assert entrada.nombre == "Ana Pérez"
    assert entrada.institucion is None
    assert entrada.rol is None
    assert entrada.origen is OrigenVisitante.CONTACTO


@pytest.mark.parametrize(
    "cambios",
    [
        {"correo": "no-es-un-correo"},
        {"nombre": "A"},
        {"mensaje": "x" * 2001},
        {"campo_extra": "no permitido"},
        {"origen": "otro"},
    ],
)
def test_la_entrada_de_visitante_rechaza_datos_invalidos(cambios):
    with pytest.raises(ValidationError):
        VisitanteEntrada(**{**VISITANTE, **cambios})


def test_a_dominio_aplica_las_reglas_de_negocio():
    entrada = VisitanteEntrada(**{**VISITANTE, "consentimiento_datos": False})

    with pytest.raises(ConsentimientoRequerido):
        entrada.a_dominio()


def test_la_pagina_traduce_entidades_del_dominio():
    evidencia = Evidencia(
        id=1,
        tipo=TipoEvidencia.FOTO,
        url="media/x",
        titulo="Foto",
        descripcion=None,
        fecha=FechaParcial(anio=2024, mes=10),
        creditos=None,
    )
    pagina = Pagina(
        elementos=(evidencia,), total=7, paginacion=Paginacion(limite=1, desplazamiento=3)
    )

    respuesta = PaginaSchema[EvidenciaSchema].desde(pagina).model_dump(mode="json")

    assert respuesta["total"] == 7
    assert (respuesta["limite"], respuesta["desplazamiento"]) == (1, 3)
    assert respuesta["elementos"][0]["fecha"] == {"anio": 2024, "mes": 10, "dia": None}
