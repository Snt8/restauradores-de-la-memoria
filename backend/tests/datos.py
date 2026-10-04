"""Constructores de contenido de prueba: usan el mismo cargador que el contenido real."""

from typing import Any

from seeds.cargador import ARCHIVOS, ContenidoInicial
from seeds.esquema import ArchivoDeSemillas


def contenido(**colecciones: list[dict[str, Any]]) -> ContenidoInicial:
    """
    `contenido(eventos=[{...}])` arma un ContenidoInicial válido con solo lo que la prueba
    necesita; las colecciones no indicadas quedan vacías.
    """
    desconocidas = set(colecciones) - ARCHIVOS.keys()
    if desconocidas:
        raise ValueError(f"Colecciones desconocidas: {desconocidas}")
    return ContenidoInicial(
        **{
            campo: ArchivoDeSemillas[esquema].model_validate(
                {"elementos": colecciones.get(campo, [])}
            )
            for campo, (_archivo, esquema) in ARCHIVOS.items()
        }
    )


def foto(url: str, titulo: str = "Foto", **extra: Any) -> dict[str, Any]:
    return {"tipo": "foto", "url": url, "titulo": titulo, **extra}
