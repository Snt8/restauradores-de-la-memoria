"""Consulta de la galería: todas las evidencias con la sección y el contenido al que pertenecen."""

from typing import Any

from sqlalchemy import ColumnElement, Select, case, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.actividades import TipoActividad
from app.domain.evidencias import ElementoGaleria, FiltrosGaleria, SeccionEvidencia
from app.domain.shared import Pagina, Paginacion
from app.infrastructure.db.models import (
    ActividadModel,
    AliadoModel,
    EventoModel,
    EvidenciaModel,
    ExposicionModel,
    ObjetoMuseoModel,
    ReconocimientoModel,
)

_SECCION_POR_TIPO_DE_ACTIVIDAD = {
    TipoActividad.SALIDA_PEDAGOGICA: SeccionEvidencia.SALIDAS,
    TipoActividad.FECHA_CONMEMORATIVA: SeccionEvidencia.CONMEMORACIONES,
    TipoActividad.FORMACION: SeccionEvidencia.FORMACION,
}

# La sección se calcula en SQL a partir de la FK que esté informada: así se puede filtrar,
# contar y paginar en la base de datos sin duplicar el dato en la tabla.
_expresion_seccion: ColumnElement[str] = case(
    (
        or_(EvidenciaModel.exposicion_id.is_not(None), EvidenciaModel.objeto_id.is_not(None)),
        SeccionEvidencia.MUSEO.value,
    ),
    (EvidenciaModel.evento_id.is_not(None), SeccionEvidencia.EVENTOS.value),
    *(
        (ActividadModel.tipo == tipo, seccion.value)
        for tipo, seccion in _SECCION_POR_TIPO_DE_ACTIVIDAD.items()
    ),
    (EvidenciaModel.reconocimiento_id.is_not(None), SeccionEvidencia.RECONOCIMIENTOS.value),
    (EvidenciaModel.aliado_id.is_not(None), SeccionEvidencia.ALIANZAS.value),
    else_=SeccionEvidencia.ARCHIVO.value,
)

_PADRES = (
    (ExposicionModel, EvidenciaModel.exposicion_id),
    (ObjetoMuseoModel, EvidenciaModel.objeto_id),
    (EventoModel, EvidenciaModel.evento_id),
    (ActividadModel, EvidenciaModel.actividad_id),
    (ReconocimientoModel, EvidenciaModel.reconocimiento_id),
    (AliadoModel, EvidenciaModel.aliado_id),
)

_expresion_contexto = func.coalesce(*(padre.nombre for padre, _fk in _PADRES))

# Si la evidencia no tiene fecha propia, se ordena con la del contenido que respalda.
_expresion_anio = func.coalesce(
    EvidenciaModel.anio, *(padre.anio for padre, _fk in _PADRES if hasattr(padre, "anio"))
)


def _consulta_base() -> Select[Any]:
    consulta = select(
        EvidenciaModel,
        _expresion_seccion.label("seccion"),
        _expresion_contexto.label("contexto"),
    )
    for padre, fk in _PADRES:
        consulta = consulta.outerjoin(padre, fk == padre.id)
    return consulta


def _condiciones(filtros: FiltrosGaleria) -> list[ColumnElement[bool]]:
    condiciones: list[ColumnElement[bool]] = []
    if filtros.tipo is not None:
        condiciones.append(EvidenciaModel.tipo == filtros.tipo)
    if filtros.seccion is not None:
        condiciones.append(_expresion_seccion == filtros.seccion.value)
    return condiciones


class RepositorioGaleriaSqlAlchemy:
    def __init__(self, sesion: AsyncSession) -> None:
        self._sesion = sesion

    async def listar(
        self, filtros: FiltrosGaleria, paginacion: Paginacion
    ) -> Pagina[ElementoGaleria]:
        consulta = _consulta_base().where(*_condiciones(filtros))
        total = await self._sesion.scalar(select(func.count()).select_from(consulta.subquery()))
        filas = await self._sesion.execute(
            consulta.order_by(
                _expresion_anio.desc().nulls_last(),
                EvidenciaModel.orden.asc(),
                EvidenciaModel.id.asc(),
            )
            .limit(paginacion.limite)
            .offset(paginacion.desplazamiento)
        )
        elementos = tuple(
            ElementoGaleria(
                evidencia=evidencia.a_dominio(),
                seccion=SeccionEvidencia(seccion),
                contexto=contexto,
            )
            for evidencia, seccion, contexto in filas
        )
        return Pagina(elementos=elementos, total=total or 0, paginacion=paginacion)
