"""Fábrica de routers de lectura: todas las colecciones exponen la misma forma de API."""

from collections.abc import Callable
from typing import Annotated, Any

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.application.contenido import ListarContenido, ObtenerContenido
from app.domain.repositorios import RepositorioLectura, RepositorioListado
from app.domain.shared import SinFiltros
from app.presentation.api.dependencies import PaginacionDep
from app.presentation.api.v1.schemas.comunes import PaginaSchema

RESPUESTA_404 = {status.HTTP_404_NOT_FOUND: {"description": "No existe un elemento con ese slug"}}


def sin_filtros() -> SinFiltros:
    return SinFiltros()


def crear_router_de_contenido(
    *,
    ruta: str,
    etiqueta: str,
    entidad: str,
    esquema: type[BaseModel],
    repositorio: Callable[..., RepositorioListado[Any, Any]],
    filtros: Callable[..., Any] = sin_filtros,
    con_detalle: bool = True,
) -> APIRouter:
    """
    Construye `GET /{ruta}` (paginado y con filtros) y, opcionalmente, `GET /{ruta}/{slug}`.
    `repositorio` y `filtros` son dependencias de FastAPI, así cada colección solo declara
    lo que la diferencia.
    """
    router = APIRouter(prefix=f"/{ruta}", tags=[etiqueta])
    esquema_pagina = PaginaSchema[esquema]  # type: ignore[valid-type]

    @router.get("", response_model=esquema_pagina, summary=f"Lista {entidad}")
    async def listar(
        repo: Annotated[RepositorioListado[Any, Any], Depends(repositorio)],
        filtros_consulta: Annotated[Any, Depends(filtros)],
        paginacion: PaginacionDep,
    ) -> Any:
        pagina = await ListarContenido(repo).ejecutar(filtros_consulta, paginacion)
        return esquema_pagina.desde(pagina)

    if con_detalle:

        @router.get(
            "/{slug}",
            response_model=esquema,
            summary=f"Detalle de {entidad}",
            responses=RESPUESTA_404,
        )
        async def obtener(
            slug: str,
            repo: Annotated[RepositorioLectura[Any, Any], Depends(repositorio)],
        ) -> Any:
            return esquema.model_validate(await ObtenerContenido(repo, entidad).ejecutar(slug))

    return router
