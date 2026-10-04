import io

import pytest
from PIL import Image

from media_pipeline.catalogo import EntradaImagen
from media_pipeline.imagenes import codificar_webp, nombre_de_salida, preparar, redimensionar

pytestmark = pytest.mark.unit


def entrada(**cambios) -> EntradaImagen:
    return EntradaImagen(fuente="f", miembro="m", destino="d", **cambios)


def test_redimensiona_al_ancho_maximo_conservando_la_proporcion():
    resultado = redimensionar(Image.new("RGB", (2000, 1000)), 500)

    assert resultado.size == (500, 250)


def test_no_amplia_imagenes_mas_pequenas_que_el_maximo():
    original = Image.new("RGB", (300, 200))

    resultado = redimensionar(original, 1280)

    assert resultado.size == (300, 200)
    assert resultado is not original


def test_preparar_recorta_y_rota_en_sentido_horario():
    imagen = Image.new("RGB", (100, 50), "white")
    imagen.putpixel((0, 0), (255, 0, 0))  # esquina superior izquierda

    resultado = preparar(imagen, entrada(recorte=(0, 0, 40, 20), rotacion=90))

    assert resultado.size == (20, 40)
    # Al girar 90° en sentido horario, la esquina superior izquierda pasa a la superior derecha.
    assert resultado.getpixel((19, 0)) == (255, 0, 0)


def test_preparar_conserva_la_transparencia_y_normaliza_paletas():
    con_alfa = preparar(Image.new("RGBA", (4, 4)), entrada())
    con_paleta = preparar(Image.new("P", (4, 4)), entrada())

    assert con_alfa.mode == "RGBA"
    assert con_paleta.mode == "RGB"


def test_codifica_en_webp():
    contenido = codificar_webp(Image.new("RGB", (8, 8), "blue"), calidad=70)

    assert contenido[:4] == b"RIFF"
    assert contenido[8:12] == b"WEBP"
    assert Image.open(io.BytesIO(contenido)).size == (8, 8)


def test_nombre_de_salida_combina_destino_y_tamano():
    assert nombre_de_salida("museo/pieza-1", "sm") == "museo/pieza-1-sm.webp"
