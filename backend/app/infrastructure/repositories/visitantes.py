"""Adaptador de RepositorioVisitantes sobre SQLAlchemy."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.visitantes import NuevoVisitante, VisitanteRegistrado
from app.infrastructure.db.models import VisitanteModel


class RepositorioVisitantesSqlAlchemy:
    def __init__(self, sesion: AsyncSession) -> None:
        self._sesion = sesion

    async def registrar(self, visitante: NuevoVisitante) -> VisitanteRegistrado:
        fila = VisitanteModel(
            nombre=visitante.nombre,
            correo=visitante.correo,
            institucion=visitante.institucion,
            rol=visitante.rol,
            mensaje=visitante.mensaje,
            origen=visitante.origen,
            consentimiento_datos=visitante.consentimiento_datos,
        )
        self._sesion.add(fila)
        await self._sesion.commit()
        await self._sesion.refresh(fila)
        return VisitanteRegistrado(id=fila.id, creado_en=fila.creado_en)
