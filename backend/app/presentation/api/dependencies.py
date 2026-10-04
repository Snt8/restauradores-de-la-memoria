"""Composición de dependencias: conecta casos de uso con sus adaptadores de infraestructura."""

from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.health import CheckReadiness
from app.core.config import Settings
from app.infrastructure.db.database import Database
from app.infrastructure.db.health import SqlAlchemyDatabaseProbe


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
