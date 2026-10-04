from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.application.health import CheckReadiness
from app.presentation.api.dependencies import get_check_readiness
from app.presentation.api.v1.schemas.health import LivenessResponse, ReadinessResponse

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=LivenessResponse, summary="El proceso de la API está vivo")
async def liveness() -> LivenessResponse:
    return LivenessResponse(status="ok")


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="La API y sus dependencias pueden atender peticiones",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ReadinessResponse}},
)
async def readiness(
    response: Response,
    check_readiness: Annotated[CheckReadiness, Depends(get_check_readiness)],
) -> ReadinessResponse:
    report = await check_readiness.execute()
    if not report.is_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ReadinessResponse.from_report(report)
