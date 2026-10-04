from pathlib import Path

import pytest
from pydantic import ValidationError

from seeds.cargador import leer_directorio
from seeds.esquema import (
    ArchivoDeSemillas,
    EventoSemilla,
    EvidenciaSemilla,
    FechaSemilla,
    ObjetoMuseoSemilla,
)

pytestmark = pytest.mark.unit

PUBLIC = Path(__file__).resolve().parents[3] / "frontend" / "public"


@pytest.fixture(scope="module")
def contenido_real():
    return leer_directorio()


def todas_las_urls(contenido) -> list[str]:
    urls = [evidencia.url for evidencia in contenido.archivo.elementos]
    for archivo in (
        contenido.exposiciones,
        contenido.objetos,
        contenido.eventos,
        contenido.actividades,
        contenido.reconocimientos,
        contenido.aliados,
    ):
        for elemento in archivo.elementos:
            urls += [evidencia.url for evidencia in elemento.evidencias]
            urls += [getattr(elemento, campo, None) or "" for campo in ("foto_url", "logo_url")]
    return [url for url in urls if url]


def test_el_contenido_inicial_es_valido(contenido_real):
    assert len(contenido_real.objetos.elementos) >= 2  # mínimo exigido para la primera entrega
    assert contenido_real.exposiciones.elementos
    assert contenido_real.eventos.elementos


def test_cada_imagen_local_tiene_sus_dos_tamanos_publicados(contenido_real):
    locales = [url for url in todas_las_urls(contenido_real) if url.startswith("media/")]
    faltantes = [
        url
        for url in locales
        for tamano in ("sm", "lg")
        if not (PUBLIC / f"{url}-{tamano}.webp").exists()
    ]

    assert locales
    assert faltantes == []


def test_cada_modelo_3d_existe_en_el_frontend(contenido_real):
    for objeto in contenido_real.objetos.elementos:
        assert objeto.modelo_3d_url, f"{objeto.slug} no tiene modelo 3D"
        assert (PUBLIC / objeto.modelo_3d_url).exists(), objeto.modelo_3d_url


def test_la_fecha_de_una_semilla_se_valida_con_el_dominio():
    with pytest.raises(ValidationError, match="requiere el mes"):
        FechaSemilla(anio=2024, dia=3)


def test_los_slugs_deben_ser_unicos_y_con_formato_de_url():
    evento = {"slug": "a", "nombre": "A", "tipo": "evento"}

    with pytest.raises(ValidationError, match="Slugs repetidos: a"):
        ArchivoDeSemillas[EventoSemilla].model_validate({"elementos": [evento, evento]})
    with pytest.raises(ValidationError):
        EventoSemilla(slug="Con Espacios", nombre="A", tipo="evento")


def test_los_creditos_por_defecto_solo_completan_los_que_faltan():
    archivo = ArchivoDeSemillas[EvidenciaSemilla].model_validate(
        {
            "creditos_por_defecto": "Archivo del proyecto",
            "elementos": [
                {"tipo": "foto", "url": "media/a", "titulo": "A"},
                {"tipo": "foto", "url": "media/b", "titulo": "B", "creditos": "City TV"},
            ],
        }
    )

    creditos = [e.creditos for e in archivo.evidencias_de(archivo.elementos)]

    assert creditos == ["Archivo del proyecto", "City TV"]


def test_las_columnas_del_objeto_expanden_fecha_y_ubicacion():
    objeto = ObjetoMuseoSemilla(
        slug="pieza",
        nombre="Pieza",
        descripcion="Descripción",
        fecha={"anio": 2025},
        ubicacion={"x": 1, "y": 2, "z": 3, "rotacion_y": 45, "escala": 2},
        exposiciones=["museo-2025"],
    )

    columnas = objeto.columnas()

    assert columnas["anio"] == 2025
    assert (columnas["pos_x"], columnas["pos_y"], columnas["pos_z"]) == (1, 2, 3)
    assert (columnas["rot_y"], columnas["escala"]) == (45, 2)
    assert "exposiciones" not in columnas
    assert "ubicacion" not in columnas
