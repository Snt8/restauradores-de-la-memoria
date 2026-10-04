import pytest
from sqlalchemy import select

from app.infrastructure.db.models import VisitanteModel

pytestmark = pytest.mark.integration

CONTACTO = {
    "nombre": "Ana Pérez",
    "correo": "ana@example.com",
    "institucion": "Colegio Tom Adams IED",
    "rol": "Docente",
    "mensaje": "Quisiera visitar el museo con mi curso.",
    "consentimiento_datos": True,
}


async def test_registra_el_contacto_y_no_devuelve_datos_personales(bd_limpia, client):
    respuesta = client.post("/api/v1/visitantes", json=CONTACTO)

    assert respuesta.status_code == 201
    cuerpo = respuesta.json()
    assert set(cuerpo) == {"id", "creado_en"}

    async with bd_limpia.open_session() as sesion:
        visitante = await sesion.scalar(select(VisitanteModel))
    assert visitante.correo == "ana@example.com"
    assert visitante.origen == "contacto"
    assert visitante.consentimiento_datos is True


def test_el_libro_de_visitas_no_requiere_mensaje(bd_limpia, client):
    firma = {
        "nombre": "Luis",
        "correo": "luis@example.com",
        "origen": "libro_visitas",
        "consentimiento_datos": True,
    }

    assert client.post("/api/v1/visitantes", json=firma).status_code == 201


@pytest.mark.parametrize(
    ("cambios", "fragmento"),
    [
        ({"consentimiento_datos": False}, "tratamiento de datos"),
        ({"mensaje": "   "}, "requiere un mensaje"),
    ],
)
def test_aplica_las_reglas_de_negocio(bd_limpia, client, cambios, fragmento):
    respuesta = client.post("/api/v1/visitantes", json={**CONTACTO, **cambios})

    assert respuesta.status_code == 422
    assert fragmento in respuesta.json()["detail"]


@pytest.mark.parametrize(
    "cambios",
    [{"correo": "sin-arroba"}, {"nombre": ""}, {"otro": "campo"}, {"consentimiento_datos": None}],
)
def test_valida_el_formato_de_los_datos(bd_limpia, client, cambios):
    assert client.post("/api/v1/visitantes", json={**CONTACTO, **cambios}).status_code == 422
