"""Casos de uso genéricos de consulta: sirven para todas las colecciones de contenido del portal."""

from typing import Any

from app.domain.repositorios import RepositorioLectura, RepositorioListado
from app.domain.shared import EntidadNoEncontrada, Pagina, Paginacion


class ListarContenido[T, F]:
    def __init__(self, repositorio: RepositorioListado[T, F]) -> None:
        self._repositorio = repositorio

    async def ejecutar(self, filtros: F, paginacion: Paginacion) -> Pagina[T]:
        return await self._repositorio.listar(filtros, paginacion)


class ObtenerContenido[T]:
    def __init__(self, repositorio: RepositorioLectura[T, Any], entidad: str) -> None:
        self._repositorio = repositorio
        self._entidad = entidad

    async def ejecutar(self, slug: str) -> T:
        encontrado = await self._repositorio.obtener(slug)
        if encontrado is None:
            raise EntidadNoEncontrada(self._entidad, slug)
        return encontrado
