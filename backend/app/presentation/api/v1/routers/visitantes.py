from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.visitantes import RegistrarVisitante
from app.presentation.api.dependencies import get_registrar_visitante
from app.presentation.api.v1.schemas.visitantes import (
    VisitanteEntrada,
    VisitanteRegistradoSchema,
)

router = APIRouter(prefix="/visitantes", tags=["visitantes"])


@router.post(
    "",
    response_model=VisitanteRegistradoSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Registra un mensaje de contacto o una firma del libro de visitas",
)
async def registrar(
    entrada: VisitanteEntrada,
    registrar_visitante: Annotated[RegistrarVisitante, Depends(get_registrar_visitante)],
) -> VisitanteRegistradoSchema:
    registrado = await registrar_visitante.ejecutar(entrada.a_dominio())
    # Solo se devuelve el id y la fecha: los datos personales no se reenvían al cliente.
    return VisitanteRegistradoSchema.model_validate(registrado)
