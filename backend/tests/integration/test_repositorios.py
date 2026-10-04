import pytest

from app.domain.actividades import FiltrosActividades, TipoActividad
from app.domain.eventos import FiltrosEventos, TipoEvento
from app.domain.evidencias import FiltrosGaleria, SeccionEvidencia, TipoEvidencia
from app.domain.shared import FechaParcial, Paginacion, SinFiltros
from app.infrastructure.repositories import contenido as configuraciones
from app.infrastructure.repositories.base import RepositorioSqlAlchemy
from app.infrastructure.repositories.galeria import RepositorioGaleriaSqlAlchemy
from seeds.cargador import cargar
from tests.datos import contenido, foto

pytestmark = pytest.mark.integration

TODO = Paginacion(limite=100)


def evento(slug: str, **extra):
    return {"slug": slug, "nombre": slug.title(), "tipo": "evento", **extra}


@pytest.fixture
async def eventos(sesion):
    await cargar(
        sesion,
        contenido(
            eventos=[
                evento("sin-fecha"),
                evento("viejo", fecha={"anio": 2021}),
                evento("nuevo-octubre", fecha={"anio": 2025, "mes": 10}),
                evento("nuevo-junio", fecha={"anio": 2025, "mes": 6}),
                evento("radio", tipo="medios", fecha={"anio": 2025}, evidencias=[foto("media/x")]),
            ]
        ),
    )
    await sesion.commit()
    return RepositorioSqlAlchemy(sesion, configuraciones.EVENTOS)


async def test_ordena_del_mas_reciente_al_mas_antiguo_con_las_fechas_pendientes_al_final(eventos):
    pagina = await eventos.listar(FiltrosEventos(), TODO)

    assert [e.slug for e in pagina.elementos] == [
        "nuevo-junio",
        "nuevo-octubre",
        "radio",
        "viejo",
        "sin-fecha",
    ]


async def test_filtra_por_tipo_y_anio(eventos):
    por_tipo = await eventos.listar(FiltrosEventos(tipo=TipoEvento.MEDIOS), TODO)
    por_anio = await eventos.listar(FiltrosEventos(anio=2025), TODO)

    assert [e.slug for e in por_tipo.elementos] == ["radio"]
    assert por_anio.total == 3


async def test_pagina_y_reporta_el_total(eventos):
    pagina = await eventos.listar(FiltrosEventos(), Paginacion(limite=2, desplazamiento=2))

    assert pagina.total == 5
    assert [e.slug for e in pagina.elementos] == ["radio", "viejo"]


async def test_obtiene_por_slug_con_sus_evidencias(eventos):
    radio = await eventos.obtener("radio")

    assert radio.fecha == FechaParcial(anio=2025)
    assert [e.url for e in radio.evidencias] == ["media/x"]
    assert await eventos.obtener("no-existe") is None


async def test_las_conmemoraciones_se_ordenan_por_el_calendario(sesion):
    await cargar(
        sesion,
        contenido(
            actividades=[
                {
                    "slug": "agosto",
                    "nombre": "31 ago",
                    "tipo": "fecha_conmemorativa",
                    "fecha": {"mes": 8, "dia": 31},
                },
                {
                    "slug": "febrero",
                    "nombre": "12 feb",
                    "tipo": "fecha_conmemorativa",
                    "fecha": {"mes": 2, "dia": 12},
                },
                {"slug": "salida", "nombre": "Salida", "tipo": "salida_pedagogica"},
            ]
        ),
    )
    await sesion.commit()
    repositorio = RepositorioSqlAlchemy(sesion, configuraciones.ACTIVIDADES)

    pagina = await repositorio.listar(
        FiltrosActividades(tipo=TipoActividad.FECHA_CONMEMORATIVA), TODO
    )

    assert [a.slug for a in pagina.elementos] == ["febrero", "agosto"]


async def test_el_objeto_trae_su_ubicacion_y_sus_exposiciones(sesion):
    await cargar(
        sesion,
        contenido(
            exposiciones=[{"slug": "museo-2025", "nombre": "Museo 2025"}],
            objetos=[
                {"slug": "b", "nombre": "B", "descripcion": "d", "orden": 2},
                {
                    "slug": "a",
                    "nombre": "A",
                    "descripcion": "d",
                    "orden": 1,
                    "ubicacion": {"x": -2, "rotacion_y": 20},
                    "exposiciones": ["museo-2025"],
                },
            ],
        ),
    )
    await sesion.commit()
    repositorio = RepositorioSqlAlchemy(sesion, configuraciones.OBJETOS_MUSEO)

    pagina = await repositorio.listar(SinFiltros(), TODO)

    primero = pagina.elementos[0]
    assert [o.slug for o in pagina.elementos] == ["a", "b"]
    assert (primero.ubicacion.x, primero.ubicacion.rotacion_y, primero.ubicacion.escala) == (
        -2,
        20,
        1,
    )
    assert [e.nombre for e in primero.exposiciones] == ["Museo 2025"]


@pytest.fixture
async def galeria(sesion):
    await cargar(
        sesion,
        contenido(
            exposiciones=[
                {
                    "slug": "museo",
                    "nombre": "Museo 2021",
                    "fecha": {"anio": 2021},
                    "evidencias": [foto("media/museo")],
                }
            ],
            eventos=[
                evento(
                    "radio",
                    tipo="medios",
                    fecha={"anio": 2025},
                    evidencias=[
                        {"tipo": "audio", "url": "https://soundcloud.com/x", "titulo": "Audio"}
                    ],
                )
            ],
            actividades=[
                {
                    "slug": "salida",
                    "nombre": "Salida a Suba",
                    "tipo": "salida_pedagogica",
                    "evidencias": [foto("media/salida")],
                },
                {
                    "slug": "abril",
                    "nombre": "9 de abril",
                    "tipo": "fecha_conmemorativa",
                    "fecha": {"mes": 4, "dia": 9},
                    "evidencias": [foto("media/abril")],
                },
            ],
            reconocimientos=[
                {"slug": "premio", "nombre": "Premio", "evidencias": [foto("media/premio")]}
            ],
            aliados=[{"slug": "aliado", "nombre": "Aliado", "evidencias": [foto("media/aliado")]}],
            archivo=[foto("media/suelta", fecha={"anio": 2023})],
        ),
    )
    await sesion.commit()
    return RepositorioGaleriaSqlAlchemy(sesion)


async def test_la_galeria_clasifica_cada_evidencia_por_seccion_y_contexto(galeria):
    pagina = await galeria.listar(FiltrosGaleria(), TODO)

    clasificacion = {e.evidencia.url: (e.seccion, e.contexto) for e in pagina.elementos}
    assert clasificacion == {
        "media/museo": (SeccionEvidencia.MUSEO, "Museo 2021"),
        "https://soundcloud.com/x": (SeccionEvidencia.EVENTOS, "Radio"),
        "media/salida": (SeccionEvidencia.SALIDAS, "Salida a Suba"),
        "media/abril": (SeccionEvidencia.CONMEMORACIONES, "9 de abril"),
        "media/premio": (SeccionEvidencia.RECONOCIMIENTOS, "Premio"),
        "media/aliado": (SeccionEvidencia.ALIANZAS, "Aliado"),
        "media/suelta": (SeccionEvidencia.ARCHIVO, None),
    }
    # Ordenada por el año de la evidencia o, si no tiene, por el de su contenido.
    assert [e.evidencia.url for e in pagina.elementos[:3]] == [
        "https://soundcloud.com/x",
        "media/suelta",
        "media/museo",
    ]


async def test_la_galeria_filtra_por_seccion_y_por_tipo(galeria):
    salidas = await galeria.listar(FiltrosGaleria(seccion=SeccionEvidencia.SALIDAS), TODO)
    audios = await galeria.listar(FiltrosGaleria(tipo=TipoEvidencia.AUDIO), TODO)
    fotos_de_museo = await galeria.listar(
        FiltrosGaleria(tipo=TipoEvidencia.FOTO, seccion=SeccionEvidencia.MUSEO), TODO
    )

    assert [e.evidencia.url for e in salidas.elementos] == ["media/salida"]
    assert audios.total == 1
    assert fotos_de_museo.total == 1
