"""Adaptador de DatabaseProbe sobre SQLAlchemy."""

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncEngine


class SqlAlchemyDatabaseProbe:
    def __init__(self, engine: AsyncEngine) -> None:
        self._engine = engine

    async def ping(self) -> bool:
        try:
            async with self._engine.connect() as connection:
                await connection.execute(text("SELECT 1"))
        except (SQLAlchemyError, OSError):
            return False
        return True
