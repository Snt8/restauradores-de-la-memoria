"""Traducción de los errores del dominio a respuestas HTTP."""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.domain.shared import EntidadNoEncontrada, ErrorDeDominio


async def _no_encontrada(_request: Request, error: Exception) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(error)})


async def _regla_de_negocio(_request: Request, error: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, content={"detail": str(error)}
    )


def registrar_manejadores_de_errores(app: FastAPI) -> None:
    # Starlette elige el manejador recorriendo la jerarquía (MRO) de la excepción:
    # EntidadNoEncontrada usa el suyo y el resto de errores de dominio caen en el general.
    app.add_exception_handler(EntidadNoEncontrada, _no_encontrada)
    app.add_exception_handler(ErrorDeDominio, _regla_de_negocio)
