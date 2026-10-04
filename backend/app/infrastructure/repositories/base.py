"""Repositorio de lectura genérico sobre SQLAlchemy: una implementación para todo el contenido."""

from collections.abc import Callable, Sequence
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import ColumnElement, Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.base import ExecutableOption

from app.domain.shared import Pagina, Paginacion


@dataclass(frozen=True, slots=True)
class ConfiguracionLectura[M, T, F]:
    """
    Lo único que cambia entre colecciones: el modelo, cómo se traduce al dominio,
    qué condiciones generan sus filtros, cómo se ordena y qué relaciones se precargan.
    """

    modelo: type[M]
    a_dominio: Callable[[M], T]
    condiciones: Callable[[F], Sequence[ColumnElement[bool]]] = lambda _filtros: ()
    orden: Sequence[Any] = ()
    precargas: Sequence[ExecutableOption] = field(default_factory=tuple)


def orden_cronologico(modelo: Any) -> tuple[Any, ...]:
    """Más reciente primero; dentro de un año, en orden del calendario; sin fecha al final."""
    return (
        modelo.anio.desc().nulls_last(),
        modelo.mes.asc().nulls_last(),
        modelo.dia.asc().nulls_last(),
        modelo.nombre.asc(),
    )


def condicion_si(columna: InstrumentedAttribute[Any], valor: Any) -> list[ColumnElement[bool]]:
    """Filtro opcional: solo agrega la condición cuando el valor viene informado."""
    return [] if valor is None else [columna == valor]


class RepositorioSqlAlchemy[M, T, F]:
    def __init__(self, sesion: AsyncSession, configuracion: ConfiguracionLectura[M, T, F]) -> None:
        self._sesion = sesion
        self._config = configuracion

    async def listar(self, filtros: F, paginacion: Paginacion) -> Pagina[T]:
        consulta = select(self._config.modelo).where(*self._config.condiciones(filtros))
        total = await self._contar(consulta)
        filas = await self._sesion.scalars(
            consulta.options(*self._config.precargas)
            .order_by(*self._config.orden)
            .limit(paginacion.limite)
            .offset(paginacion.desplazamiento)
        )
        elementos = tuple(self._config.a_dominio(fila) for fila in filas)
        return Pagina(elementos=elementos, total=total, paginacion=paginacion)

    async def obtener(self, slug: str) -> T | None:
        modelo: Any = self._config.modelo
        fila = await self._sesion.scalar(
            select(modelo).where(modelo.slug == slug).options(*self._config.precargas)
        )
        return None if fila is None else self._config.a_dominio(fila)

    async def _contar(self, consulta: Select[Any]) -> int:
        return await self._sesion.scalar(select(func.count()).select_from(consulta.subquery())) or 0
