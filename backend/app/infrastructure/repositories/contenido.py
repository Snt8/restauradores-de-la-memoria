"""Configuración de lectura de cada colección: qué filtra, cómo ordena y qué precarga."""

from sqlalchemy.orm import selectinload

from app.domain.actividades import Actividad, FiltrosActividades
from app.domain.aliados import Aliado
from app.domain.eventos import Evento, FiltrosEventos
from app.domain.museo import Exposicion, ObjetoMuseo
from app.domain.reconocimientos import Reconocimiento
from app.domain.shared import SinFiltros
from app.infrastructure.db.models import (
    ActividadModel,
    AliadoModel,
    EventoModel,
    ExposicionModel,
    ObjetoMuseoModel,
    ReconocimientoModel,
)
from app.infrastructure.repositories.base import (
    ConfiguracionLectura,
    condicion_si,
    orden_cronologico,
)

EXPOSICIONES = ConfiguracionLectura[ExposicionModel, Exposicion, SinFiltros](
    modelo=ExposicionModel,
    a_dominio=ExposicionModel.a_dominio,
    orden=orden_cronologico(ExposicionModel),
    precargas=(selectinload(ExposicionModel.evidencias),),
)

OBJETOS_MUSEO = ConfiguracionLectura[ObjetoMuseoModel, ObjetoMuseo, SinFiltros](
    modelo=ObjetoMuseoModel,
    a_dominio=ObjetoMuseoModel.a_dominio,
    orden=(ObjetoMuseoModel.orden.asc(), ObjetoMuseoModel.nombre.asc()),
    precargas=(
        selectinload(ObjetoMuseoModel.evidencias),
        selectinload(ObjetoMuseoModel.exposiciones),
    ),
)

EVENTOS = ConfiguracionLectura[EventoModel, Evento, FiltrosEventos](
    modelo=EventoModel,
    a_dominio=EventoModel.a_dominio,
    condiciones=lambda filtros: [
        *condicion_si(EventoModel.tipo, filtros.tipo),
        *condicion_si(EventoModel.anio, filtros.anio),
    ],
    orden=orden_cronologico(EventoModel),
    precargas=(selectinload(EventoModel.evidencias),),
)

ACTIVIDADES = ConfiguracionLectura[ActividadModel, Actividad, FiltrosActividades](
    modelo=ActividadModel,
    a_dominio=ActividadModel.a_dominio,
    condiciones=lambda filtros: [
        *condicion_si(ActividadModel.tipo, filtros.tipo),
        *condicion_si(ActividadModel.anio, filtros.anio),
    ],
    orden=orden_cronologico(ActividadModel),
    precargas=(selectinload(ActividadModel.evidencias),),
)

RECONOCIMIENTOS = ConfiguracionLectura[ReconocimientoModel, Reconocimiento, SinFiltros](
    modelo=ReconocimientoModel,
    a_dominio=ReconocimientoModel.a_dominio,
    orden=orden_cronologico(ReconocimientoModel),
    precargas=(selectinload(ReconocimientoModel.evidencias),),
)

ALIADOS = ConfiguracionLectura[AliadoModel, Aliado, SinFiltros](
    modelo=AliadoModel,
    a_dominio=AliadoModel.a_dominio,
    orden=(AliadoModel.nombre.asc(),),
    precargas=(selectinload(AliadoModel.evidencias),),
)
