"""Caso de uso: registrar a un visitante (contacto o libro de visitas)."""

from app.domain.visitantes import NuevoVisitante, RepositorioVisitantes, VisitanteRegistrado


class RegistrarVisitante:
    def __init__(self, repositorio: RepositorioVisitantes) -> None:
        self._repositorio = repositorio

    async def ejecutar(self, visitante: NuevoVisitante) -> VisitanteRegistrado:
        # Las reglas de negocio (consentimiento, mensaje) se validan al construir NuevoVisitante.
        return await self._repositorio.registrar(visitante)
