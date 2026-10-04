"""Configuración de la aplicación leída desde variables de entorno o el archivo .env."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Restauradores de la Memoria API"
    environment: Literal["development", "test", "production"] = "development"
    api_v1_prefix: str = "/api/v1"

    database_url: str = (
        "postgresql+asyncpg://restauradores:restauradores@localhost:5433/restauradores"
    )
    database_echo: bool = False
    db_health_timeout_seconds: float = Field(default=2.0, gt=0)

    cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("database_url")
    @classmethod
    def usar_driver_asincrono(cls, url: str) -> str:
        """
        Render y otros proveedores entregan la URL como postgres:// o postgresql://.
        La API usa SQLAlchemy asíncrono, que necesita el driver explícito (asyncpg).
        """
        for esquema in ("postgres://", "postgresql://"):
            if url.startswith(esquema):
                return "postgresql+asyncpg://" + url.removeprefix(esquema)
        return url


@lru_cache
def get_settings() -> Settings:
    """Devuelve una única instancia de configuración por proceso."""
    return Settings()
