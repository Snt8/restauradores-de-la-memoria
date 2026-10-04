"""Puertos de lectura del contenido. La infraestructura los implementa; la aplicación los usa."""

from typing import Protocol

from app.domain.shared import Pagina, Paginacion


class RepositorioListado[T, F](Protocol):
    """Colección que se consulta con filtros `F` y se devuelve paginada como entidades `T`."""

    async def listar(self, filtros: F, paginacion: Paginacion) -> Pagina[T]: ...


class RepositorioLectura[T, F](RepositorioListado[T, F], Protocol):
    """Colección que además permite obtener un elemento por su slug."""

    async def obtener(self, slug: str) -> T | None: ...
