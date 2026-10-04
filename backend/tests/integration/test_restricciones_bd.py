"""La base de datos protege la integridad aunque alguien la escriba sin pasar por la API."""

import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from seeds.cargador import cargar
from tests.datos import contenido

pytestmark = pytest.mark.integration


async def ejecutar_y_esperar_rechazo(sesion, sql: str, restriccion: str) -> None:
    with pytest.raises(IntegrityError, match=restriccion):
        await sesion.execute(text(sql))
    await sesion.rollback()


async def test_una_evidencia_no_puede_tener_dos_padres(sesion):
    await cargar(
        sesion,
        contenido(
            eventos=[{"slug": "e", "nombre": "E", "tipo": "evento"}],
            aliados=[{"slug": "a", "nombre": "A"}],
        ),
    )
    await sesion.commit()

    await ejecutar_y_esperar_rechazo(
        sesion,
        "INSERT INTO evidencias (tipo, url, titulo, evento_id, aliado_id) "
        "VALUES ('foto', 'media/x', 'X', 1, 1)",
        "ck_evidencias_un_padre",
    )


async def test_no_se_guardan_visitantes_sin_consentimiento(sesion):
    await ejecutar_y_esperar_rechazo(
        sesion,
        "INSERT INTO visitantes (nombre, correo, origen, consentimiento_datos) "
        "VALUES ('Ana', 'a@b.co', 'contacto', false)",
        "ck_visitantes_consentimiento_obligatorio",
    )


@pytest.mark.parametrize(
    ("columnas", "restriccion"),
    [
        ("anio, mes", "ck_eventos_mes_valido"),
        ("mes, dia", "ck_eventos_mes_requiere_anio_o_dia"),
    ],
)
async def test_las_fechas_parciales_incoherentes_se_rechazan(sesion, columnas, restriccion):
    valores = {"anio, mes": "2024, 13", "mes, dia": "4, NULL"}[columnas]
    await ejecutar_y_esperar_rechazo(
        sesion,
        f"INSERT INTO eventos (slug, nombre, tipo, {columnas}) "
        f"VALUES ('e', 'E', 'evento', {valores})",
        restriccion,
    )


async def test_los_tipos_solo_admiten_valores_del_dominio(sesion):
    await ejecutar_y_esperar_rechazo(
        sesion,
        "INSERT INTO eventos (slug, nombre, tipo) VALUES ('e', 'E', 'fiesta')",
        "ck_eventos_tipo_evento",
    )


async def test_el_slug_es_unico(sesion):
    await cargar(sesion, contenido(eventos=[{"slug": "e", "nombre": "E", "tipo": "evento"}]))
    await sesion.commit()

    await ejecutar_y_esperar_rechazo(
        sesion,
        "INSERT INTO eventos (slug, nombre, tipo) VALUES ('e', 'Otro', 'evento')",
        "uq_eventos_slug",
    )
