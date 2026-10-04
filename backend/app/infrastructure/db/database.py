"""Ciclo de vida del motor de base de datos y fábrica de sesiones."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)


class Database:
    def __init__(self, url: str, *, echo: bool = False) -> None:
        self.engine: AsyncEngine = create_async_engine(url, echo=echo, pool_pre_ping=True)
        self._session_factory = async_sessionmaker(self.engine, expire_on_commit=False)

    @asynccontextmanager
    async def open_session(self) -> AsyncIterator[AsyncSession]:
        """Sesión para scripts y tareas fuera de una petición HTTP (p. ej. cargar contenido)."""
        async with self._session_factory() as session:
            yield session

    async def session(self) -> AsyncIterator[AsyncSession]:
        """Entrega una sesión por petición y la cierra al terminar (dependencia de FastAPI)."""
        async with self.open_session() as session:
            yield session

    async def dispose(self) -> None:
        await self.engine.dispose()
