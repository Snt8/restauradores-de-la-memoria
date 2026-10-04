import pytest
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.infrastructure.db.base import Base
from app.infrastructure.db.models import EventoModel, EvidenciaModel, ObjetoMuseoModel
from seeds.cargador import ReferenciaInvalida, cargar, leer_directorio
from seeds.load import ejecutar
from tests.datos import contenido, foto

pytestmark = pytest.mark.integration

OBJETO = {
    "slug": "pieza",
    "nombre": "Pieza",
    "descripcion": "Descripción",
    "modelo_3d_url": "models/pieza.glb",
    "ubicacion": {"x": 1.5, "escala": 2},
}


async def conteos(sesion) -> dict[str, int]:
    resultado = {}
    for tabla in Base.metadata.sorted_tables:
        resultado[tabla.name] = await sesion.scalar(select(func.count()).select_from(tabla))
    return resultado


async def test_carga_el_contenido_real_y_es_idempotente(sesion):
    contenido_real = leer_directorio()

    resumen = await cargar(sesion, contenido_real)
    await sesion.commit()
    primera = await conteos(sesion)
    await cargar(sesion, contenido_real)
    await sesion.commit()

    assert await conteos(sesion) == primera
    assert primera["evidencias"] == resumen.evidencias
    assert primera["eventos"] == len(contenido_real.eventos.elementos)
    assert primera["visitantes"] == 0


async def test_actualiza_por_slug_y_reemplaza_las_evidencias(sesion):
    evento = {"slug": "festival", "nombre": "Festival", "tipo": "evento"}
    await cargar(
        sesion, contenido(eventos=[{**evento, "evidencias": [foto("media/a"), foto("media/b")]}])
    )
    await sesion.commit()

    await cargar(
        sesion,
        contenido(
            eventos=[{**evento, "nombre": "Festival de Arte", "evidencias": [foto("media/c")]}]
        ),
    )
    await sesion.commit()

    fila = await sesion.scalar(
        select(EventoModel)
        .options(selectinload(EventoModel.evidencias))
        .execution_options(populate_existing=True)
    )
    assert fila.nombre == "Festival de Arte"
    assert [e.url for e in fila.evidencias] == ["media/c"]
    assert await sesion.scalar(select(func.count()).select_from(EvidenciaModel)) == 1


async def test_vincula_objetos_con_sus_exposiciones(sesion):
    await cargar(
        sesion,
        contenido(
            exposiciones=[{"slug": "museo-2025", "nombre": "Museo 2025"}],
            objetos=[{**OBJETO, "exposiciones": ["museo-2025"]}],
        ),
    )
    await sesion.commit()

    objeto = await sesion.scalar(
        select(ObjetoMuseoModel).options(
            selectinload(ObjetoMuseoModel.exposiciones), selectinload(ObjetoMuseoModel.evidencias)
        )
    )
    assert [e.slug for e in objeto.exposiciones] == ["museo-2025"]
    assert (objeto.pos_x, objeto.escala) == (1.5, 2)


async def test_rechaza_referencias_a_exposiciones_inexistentes(sesion):
    with pytest.raises(ReferenciaInvalida, match="no-existe"):
        await cargar(sesion, contenido(objetos=[{**OBJETO, "exposiciones": ["no-existe"]}]))


async def test_el_archivo_general_se_reemplaza_en_bloque(sesion):
    await cargar(sesion, contenido(archivo=[foto("media/a"), foto("media/b")]))
    await cargar(sesion, contenido(archivo=[foto("media/c")]))
    await sesion.commit()

    urls = (await sesion.scalars(select(EvidenciaModel.url))).all()
    assert urls == ["media/c"]


async def test_la_cli_carga_y_confirma_la_transaccion(bd_limpia, test_database_url, tmp_path):
    resumen = await ejecutar(test_database_url, directorio=_directorio_minimo(tmp_path))

    async with bd_limpia.open_session() as sesion:
        assert await sesion.scalar(select(func.count()).select_from(EventoModel)) == 1
    assert resumen.elementos["eventos"] == 1


def _directorio_minimo(tmp_path):
    vacio = '{"elementos": []}'
    for nombre in (
        "exposiciones",
        "objetos_museo",
        "actividades",
        "reconocimientos",
        "aliados",
        "archivo",
    ):
        (tmp_path / f"{nombre}.json").write_text(vacio, encoding="utf-8")
    (tmp_path / "eventos.json").write_text(
        '{"elementos": [{"slug": "e", "nombre": "Evento", "tipo": "evento"}]}', encoding="utf-8"
    )
    return tmp_path
