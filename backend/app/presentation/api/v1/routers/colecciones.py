"""Routers de lectura de cada colección del portal, construidos con la fábrica común."""

from typing import Annotated

from fastapi import Query

from app.domain.actividades import FiltrosActividades, TipoActividad
from app.domain.eventos import FiltrosEventos, TipoEvento
from app.domain.evidencias import FiltrosGaleria, SeccionEvidencia, TipoEvidencia
from app.domain.shared import ANIO_MAXIMO, ANIO_MINIMO
from app.infrastructure.repositories import contenido as configuraciones
from app.presentation.api.dependencies import get_repositorio_galeria, proveedor_de_lectura
from app.presentation.api.v1.routers.contenido import crear_router_de_contenido
from app.presentation.api.v1.schemas.contenido import (
    ActividadSchema,
    AliadoSchema,
    ElementoGaleriaSchema,
    EventoSchema,
    ExposicionSchema,
    ObjetoMuseoSchema,
    ReconocimientoSchema,
)

AnioQuery = Annotated[int | None, Query(ge=ANIO_MINIMO, le=ANIO_MAXIMO)]


def filtros_eventos(tipo: TipoEvento | None = None, anio: AnioQuery = None) -> FiltrosEventos:
    return FiltrosEventos(tipo=tipo, anio=anio)


def filtros_actividades(
    tipo: TipoActividad | None = None, anio: AnioQuery = None
) -> FiltrosActividades:
    return FiltrosActividades(tipo=tipo, anio=anio)


def filtros_galeria(
    tipo: TipoEvidencia | None = None, seccion: SeccionEvidencia | None = None
) -> FiltrosGaleria:
    return FiltrosGaleria(tipo=tipo, seccion=seccion)


routers = (
    crear_router_de_contenido(
        ruta="exposiciones",
        etiqueta="museo",
        entidad="exposiciones del museo",
        esquema=ExposicionSchema,
        repositorio=proveedor_de_lectura(configuraciones.EXPOSICIONES),
    ),
    crear_router_de_contenido(
        ruta="objetos",
        etiqueta="museo",
        entidad="objetos del museo",
        esquema=ObjetoMuseoSchema,
        repositorio=proveedor_de_lectura(configuraciones.OBJETOS_MUSEO),
    ),
    crear_router_de_contenido(
        ruta="eventos",
        etiqueta="eventos",
        entidad="visitas, eventos y medios",
        esquema=EventoSchema,
        repositorio=proveedor_de_lectura(configuraciones.EVENTOS),
        filtros=filtros_eventos,
    ),
    crear_router_de_contenido(
        ruta="actividades",
        etiqueta="actividades",
        entidad="salidas pedagógicas, fechas conmemorativas y formación",
        esquema=ActividadSchema,
        repositorio=proveedor_de_lectura(configuraciones.ACTIVIDADES),
        filtros=filtros_actividades,
    ),
    crear_router_de_contenido(
        ruta="reconocimientos",
        etiqueta="reconocimientos",
        entidad="reconocimientos",
        esquema=ReconocimientoSchema,
        repositorio=proveedor_de_lectura(configuraciones.RECONOCIMIENTOS),
    ),
    crear_router_de_contenido(
        ruta="aliados",
        etiqueta="alianzas",
        entidad="aliados institucionales",
        esquema=AliadoSchema,
        repositorio=proveedor_de_lectura(configuraciones.ALIADOS),
    ),
    crear_router_de_contenido(
        ruta="galeria",
        etiqueta="galería",
        entidad="evidencias de la galería multimedia",
        esquema=ElementoGaleriaSchema,
        repositorio=get_repositorio_galeria,
        filtros=filtros_galeria,
        con_detalle=False,
    ),
)
