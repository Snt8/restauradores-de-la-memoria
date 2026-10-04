"""Router raíz de la versión 1 de la API. Cada módulo nuevo registra aquí su router."""

from fastapi import APIRouter

from app.presentation.api.v1.routers import health

api_router = APIRouter()
api_router.include_router(health.router)
