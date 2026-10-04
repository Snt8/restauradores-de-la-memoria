"""
Carga el contenido inicial del portal en la base de datos.

Uso (desde backend/, con las migraciones aplicadas):
    python -m seeds.load
    python -m seeds.load --database-url postgresql+asyncpg://... --directorio otra/carpeta
"""

import argparse
import asyncio
from collections.abc import Sequence
from pathlib import Path

from app.core.config import get_settings
from app.infrastructure.db.database import Database
from seeds.cargador import DIRECTORIO_POR_DEFECTO, Resumen, cargar, leer_directorio


async def ejecutar(database_url: str, directorio: Path) -> Resumen:
    contenido = leer_directorio(directorio)  # valida todos los archivos antes de tocar la base
    database = Database(database_url)
    try:
        async with database.open_session() as sesion:
            resumen = await cargar(sesion, contenido)
            await sesion.commit()
            return resumen
    finally:
        await database.dispose()


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Carga el contenido inicial del portal.")
    parser.add_argument("--database-url", default=None)
    parser.add_argument("--directorio", type=Path, default=DIRECTORIO_POR_DEFECTO)
    args = parser.parse_args(argv)

    resumen = asyncio.run(
        ejecutar(args.database_url or get_settings().database_url, args.directorio)
    )
    for tabla, cantidad in resumen.elementos.items():
        print(f"  {tabla}: {cantidad}")
    print(f"  evidencias en total: {resumen.evidencias}")


if __name__ == "__main__":
    main()
