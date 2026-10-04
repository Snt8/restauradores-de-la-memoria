"""Punto de entrada de la API: ensambla configuración, base de datos y routers."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings, get_settings
from app.infrastructure.db.database import Database
from app.presentation.api.errores import registrar_manejadores_de_errores
from app.presentation.api.v1.router import api_router


def create_app(settings: Settings | None = None) -> FastAPI:
    """Fábrica de la aplicación. Recibir `settings` permite crear instancias aisladas en pruebas."""
    settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        database = Database(settings.database_url, echo=settings.database_echo)
        app.state.settings = settings
        app.state.database = database
        try:
            yield
        finally:
            await database.dispose()

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
        docs_url=None if settings.environment == "production" else "/docs",
        redoc_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )
    registrar_manejadores_de_errores(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
