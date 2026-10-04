from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.domain.visitantes import NuevoVisitante, OrigenVisitante
from app.presentation.api.v1.schemas.comunes import EsquemaDeDominio


class VisitanteEntrada(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    nombre: Annotated[str, Field(min_length=2, max_length=120)]
    correo: Annotated[EmailStr, Field(max_length=254)]
    institucion: Annotated[str | None, Field(max_length=150)] = None
    rol: Annotated[str | None, Field(max_length=80)] = None
    mensaje: Annotated[str | None, Field(max_length=2000)] = None
    origen: OrigenVisitante = OrigenVisitante.CONTACTO
    consentimiento_datos: bool

    @field_validator("institucion", "rol", "mensaje", mode="after")
    @classmethod
    def vacio_es_nulo(cls, valor: str | None) -> str | None:
        return valor or None

    def a_dominio(self) -> NuevoVisitante:
        return NuevoVisitante(**self.model_dump())


class VisitanteRegistradoSchema(EsquemaDeDominio):
    id: int
    creado_en: datetime
