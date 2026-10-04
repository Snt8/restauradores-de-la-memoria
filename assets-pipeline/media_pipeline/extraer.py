"""
Extrae las imágenes del catálogo desde los documentos fuente (.docx/.pptx) y las publica en WebP.

Uso (desde assets-pipeline/):
    python -m media_pipeline.extraer \
        --fuentes ../.claude/third-party --destino ../frontend/public/media
"""

import argparse
import io
import zipfile
from collections.abc import Sequence
from contextlib import ExitStack
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

from media_pipeline.catalogo import Catalogo, cargar_catalogo
from media_pipeline.imagenes import codificar_webp, nombre_de_salida, preparar, redimensionar

RAIZ = Path(__file__).resolve().parents[1]


@dataclass(frozen=True, slots=True)
class Resumen:
    imagenes: int
    archivos: int
    bytes_escritos: int


def procesar(catalogo: Catalogo, dir_fuentes: Path, dir_destino: Path) -> Resumen:
    """Genera cada tamaño de cada imagen. Los .docx y .pptx son ZIP: se leen sin descomprimirlos."""
    archivos = 0
    bytes_escritos = 0
    with ExitStack() as pila:
        fuentes = {
            clave: pila.enter_context(zipfile.ZipFile(dir_fuentes / nombre))
            for clave, nombre in catalogo.fuentes.items()
        }
        for entrada in catalogo.imagenes:
            with Image.open(io.BytesIO(fuentes[entrada.fuente].read(entrada.miembro))) as original:
                imagen = preparar(original, entrada)
            for tamano, ancho in catalogo.tamanos.items():
                destino = dir_destino / nombre_de_salida(entrada.destino, tamano)
                destino.parent.mkdir(parents=True, exist_ok=True)
                contenido = codificar_webp(redimensionar(imagen, ancho), catalogo.calidad)
                destino.write_bytes(contenido)
                archivos += 1
                bytes_escritos += len(contenido)
    return Resumen(
        imagenes=len(catalogo.imagenes), archivos=archivos, bytes_escritos=bytes_escritos
    )


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    parser.add_argument("--catalogo", type=Path, default=RAIZ / "catalogo.json")
    parser.add_argument("--fuentes", type=Path, default=RAIZ.parent / ".claude" / "third-party")
    parser.add_argument(
        "--destino", type=Path, default=RAIZ.parent / "frontend" / "public" / "media"
    )
    args = parser.parse_args(argv)

    resumen = procesar(cargar_catalogo(args.catalogo), args.fuentes, args.destino)
    print(
        f"{resumen.imagenes} imágenes procesadas: {resumen.archivos} archivos WebP "
        f"({resumen.bytes_escritos / 1_048_576:.1f} MB) en {args.destino}"
    )


if __name__ == "__main__":
    main()
