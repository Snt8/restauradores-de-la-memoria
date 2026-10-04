"""Composición de dependencias: conecta casos de uso con sus adaptadores de infraestructura."""

from collections.abc import AsyncIterator, Callable
from typing import Annotated

from fastapi import Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.health import CheckReadiness
from app.application.visitantes import RegistrarVisitante
from app.core.config import Settings
from app.domain.shared import Paginacion
from app.infrastructure.db.database import Database
from app.infrastructure.db.health import SqlAlchemyDatabaseProbe
from app.infrastructure.repositories.base import ConfiguracionLectura, RepositorioSqlAlchemy
from app.infrastructure.repositories.galeria import RepositorioGaleriaSqlAlchemy
from app.infrastructure.repositories.visitantes import RepositorioVisitantesSqlAlchemy


def get_settings_from_app(request: Request) -> Settings:
    return request.app.state.settings


def get_database(request: Request) -> Database:
    return request.app.state.database


SettingsDep = Annotated[Settings, Depends(get_settings_from_app)]
DatabaseDep = Annotated[Database, Depends(get_database)]


async def get_db_session(database: DatabaseDep) -> AsyncIterator[AsyncSession]:
    async for session in database.session():
        yield session


DbSessionDep = Annotated[AsyncSession, Depends(get_db_session)]


def get_check_readiness(database: DatabaseDep, settings: SettingsDep) -> CheckReadiness:
    return CheckReadiness(
        SqlAlchemyDatabaseProbe(database.engine),
        timeout_seconds=settings.db_health_timeout_seconds,
    )


def get_paginacion(
    limite: Annotated[int, Query(ge=1, le=Paginacion.LIMITE_MAXIMO)] = 50,
    desplazamiento: Annotated[int, Query(ge=0)] = 0,
) -> Paginacion:
    return Paginacion(limite=limite, desplazamiento=desplazamiento)


PaginacionDep = Annotated[Paginacion, Depends(get_paginacion)]


def proveedor_de_lectura[M, T, F](
    configuracion: ConfiguracionLectura[M, T, F],
) -> Callable[[AsyncSession], RepositorioSqlAlchemy[M, T, F]]:
    """Crea la dependencia que entrega el repositorio de una colección para cada petición."""

    def proveer(sesion: DbSessionDep) -> RepositorioSqlAlchemy[M, T, F]:
        return RepositorioSqlAlchemy(sesion, configuracion)

    return proveer


def get_repositorio_galeria(sesion: DbSessionDep) -> RepositorioGaleriaSqlAlchemy:
    return RepositorioGaleriaSqlAlchemy(sesion)


def get_registrar_visitante(sesion: DbSessionDep) -> RegistrarVisitante:
    return RegistrarVisitante(RepositorioVisitantesSqlAlchemy(sesion))
