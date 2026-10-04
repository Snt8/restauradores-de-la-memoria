import io
import zipfile
from pathlib import Path

import pytest
from PIL import Image

from media_pipeline import extraer, modelos
from media_pipeline.catalogo import cargar_catalogo, parsear_catalogo
from tests.glb import leer_glb

pytestmark = pytest.mark.integration

RAIZ = Path(__file__).resolve().parents[2]
FUENTES_REALES = RAIZ.parent / ".claude" / "third-party"


def png(ancho: int, alto: int) -> bytes:
    salida = io.BytesIO()
    Image.new("RGB", (ancho, alto), "orange").save(salida, format="PNG")
    return salida.getvalue()


@pytest.fixture
def fuentes(tmp_path: Path) -> Path:
    """Un .pptx falso: para el pipeline basta con que sea un ZIP con imágenes dentro."""
    directorio = tmp_path / "fuentes"
    directorio.mkdir()
    with zipfile.ZipFile(directorio / "presentacion.pptx", "w") as archivo:
        archivo.writestr("ppt/media/grande.png", png(2000, 1000))
        archivo.writestr("ppt/media/pequena.png", png(300, 300))
    return directorio


def test_procesar_genera_cada_tamano_de_cada_imagen(fuentes: Path, tmp_path: Path):
    catalogo = parsear_catalogo(
        {
            "fuentes": {"p": "presentacion.pptx"},
            "tamanos": {"sm": 480, "lg": 1280},
            "calidad": 70,
            "imagenes": [
                {"fuente": "p", "miembro": "ppt/media/grande.png", "destino": "museo/grande"},
                {"fuente": "p", "miembro": "ppt/media/pequena.png", "destino": "eventos/pequena"},
            ],
        }
    )
    destino = tmp_path / "media"

    resumen = extraer.procesar(catalogo, fuentes, destino)

    assert (resumen.imagenes, resumen.archivos) == (2, 4)
    assert Image.open(destino / "museo/grande-sm.webp").size == (480, 240)
    assert Image.open(destino / "museo/grande-lg.webp").size == (1280, 640)
    assert Image.open(destino / "eventos/pequena-lg.webp").size == (300, 300)
    assert resumen.bytes_escritos == sum(f.stat().st_size for f in destino.rglob("*.webp"))


def test_la_cli_usa_las_rutas_recibidas(fuentes: Path, tmp_path: Path, capsys):
    ruta_catalogo = tmp_path / "catalogo.json"
    ruta_catalogo.write_text(
        '{"fuentes": {"p": "presentacion.pptx"}, "tamanos": {"sm": 100}, "calidad": 60,'
        ' "imagenes": [{"fuente": "p", "miembro": "ppt/media/pequena.png", "destino": "a/b"}]}',
        encoding="utf-8",
    )

    extraer.main(
        [
            "--catalogo",
            str(ruta_catalogo),
            "--fuentes",
            str(fuentes),
            "--destino",
            str(tmp_path / "out"),
        ]
    )

    assert (tmp_path / "out/a/b-sm.webp").exists()
    assert "1 imágenes procesadas" in capsys.readouterr().out


def test_generar_escribe_modelos_glb_legibles(tmp_path: Path):
    escritos = modelos.generar(tmp_path)

    assert {ruta.name for ruta in escritos} == set(modelos.MODELOS_PROVISIONALES)
    for ruta in escritos:
        documento, _ = leer_glb(ruta.read_bytes())
        assert "provisional" in documento["asset"]["generator"]


@pytest.mark.skipif(
    not FUENTES_REALES.exists(), reason="El material fuente del docente no se versiona en git."
)
def test_todas_las_imagenes_del_catalogo_existen_en_las_fuentes():
    catalogo = cargar_catalogo(RAIZ / "catalogo.json")

    for clave, nombre in catalogo.fuentes.items():
        with zipfile.ZipFile(FUENTES_REALES / nombre) as archivo:
            miembros = set(archivo.namelist())
        faltantes = [
            i.miembro for i in catalogo.imagenes if i.fuente == clave and i.miembro not in miembros
        ]
        assert faltantes == [], f"No existen en {nombre}: {faltantes}"
