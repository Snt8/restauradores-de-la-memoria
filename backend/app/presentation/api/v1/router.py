"""Router raíz de la versión 1 de la API. Cada módulo nuevo registra aquí su router."""

from fastapi import APIRouter

from app.presentation.api.v1.routers import colecciones, health, visitantes

api_router = APIRouter()
api_router.include_router(health.router)
for router_de_coleccion in colecciones.routers:
    api_router.include_router(router_de_coleccion)
api_router.include_router(visitantes.router)
