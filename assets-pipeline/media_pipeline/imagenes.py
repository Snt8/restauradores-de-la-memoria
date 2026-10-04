"""Transformaciones de imagen puras: preparar, redimensionar y codificar en WebP."""

import io

from PIL import Image, ImageOps

from media_pipeline.catalogo import EntradaImagen


def preparar(imagen: Image.Image, entrada: EntradaImagen) -> Image.Image:
    """Corrige la orientación EXIF, normaliza el modo de color y aplica recorte y rotación."""
    resultado = ImageOps.exif_transpose(imagen)
    resultado = resultado.convert("RGBA" if _tiene_transparencia(resultado) else "RGB")
    if entrada.recorte is not None:
        resultado = resultado.crop(entrada.recorte)
    if entrada.rotacion:
        # PIL rota en sentido antihorario; el catálogo expresa grados en sentido horario.
        resultado = resultado.rotate(-entrada.rotacion, expand=True)
    return resultado


def redimensionar(imagen: Image.Image, ancho_maximo: int) -> Image.Image:
    """Reduce al ancho máximo conservando la proporción. Nunca amplía: no inventa detalle."""
    if imagen.width <= ancho_maximo:
        return imagen.copy()
    alto = round(imagen.height * ancho_maximo / imagen.width)
    return imagen.resize((ancho_maximo, alto), Image.Resampling.LANCZOS)


def codificar_webp(imagen: Image.Image, calidad: int) -> bytes:
    salida = io.BytesIO()
    imagen.save(salida, format="WEBP", quality=calidad, method=6)
    return salida.getvalue()


def nombre_de_salida(destino: str, tamano: str) -> str:
    return f"{destino}-{tamano}.webp"


def _tiene_transparencia(imagen: Image.Image) -> bool:
    return imagen.mode in {"RGBA", "LA"} or (imagen.mode == "P" and "transparency" in imagen.info)
