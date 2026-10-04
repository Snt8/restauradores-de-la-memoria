"""Catálogo de medios: qué imagen de qué fuente se publica, con qué nombre y qué ajustes."""

import json
import re
from dataclasses import dataclass
from pathlib import Path

PATRON_DESTINO = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$")
ROTACIONES_VALIDAS = frozenset({0, 90, 180, 270})


class CatalogoInvalido(ValueError):
    """El catálogo tiene un error que impediría generar los medios de forma predecible."""


@dataclass(frozen=True, slots=True)
class EntradaImagen:
    fuente: str
    miembro: str
    destino: str
    recorte: tuple[int, int, int, int] | None = None
    rotacion: int = 0


@dataclass(frozen=True, slots=True)
class Catalogo:
    fuentes: dict[str, str]
    tamanos: dict[str, int]
    calidad: int
    imagenes: tuple[EntradaImagen, ...]


def _entrada(datos: dict, fuentes: dict[str, str]) -> EntradaImagen:
    entrada = EntradaImagen(
        fuente=datos["fuente"],
        miembro=datos["miembro"],
        destino=datos["destino"],
        recorte=tuple(datos["recorte"]) if datos.get("recorte") else None,
        rotacion=datos.get("rotacion", 0),
    )
    if entrada.fuente not in fuentes:
        raise CatalogoInvalido(f"Fuente desconocida '{entrada.fuente}' en {entrada.destino}.")
    if not PATRON_DESTINO.match(entrada.destino):
        raise CatalogoInvalido(f"Destino inválido '{entrada.destino}': usa minúsculas y guiones.")
    if entrada.rotacion not in ROTACIONES_VALIDAS:
        raise CatalogoInvalido(f"Rotación inválida {entrada.rotacion} en {entrada.destino}.")
    if entrada.recorte is not None:
        if len(entrada.recorte) != 4:
            raise CatalogoInvalido(f"El recorte de {entrada.destino} necesita 4 valores.")
        izquierda, arriba, derecha, abajo = entrada.recorte
        if izquierda >= derecha or arriba >= abajo:
            raise CatalogoInvalido(f"Recorte inválido en {entrada.destino}.")
    return entrada


def parsear_catalogo(datos: dict) -> Catalogo:
    fuentes = dict(datos["fuentes"])
    tamanos = dict(datos["tamanos"])
    calidad = int(datos["calidad"])
    if not 1 <= calidad <= 100:
        raise CatalogoInvalido("La calidad debe estar entre 1 y 100.")
    if not tamanos or any(ancho <= 0 for ancho in tamanos.values()):
        raise CatalogoInvalido("Define al menos un tamaño, con anchos positivos.")

    imagenes = tuple(_entrada(entrada, fuentes) for entrada in datos["imagenes"])
    destinos = [imagen.destino for imagen in imagenes]
    repetidos = sorted({destino for destino in destinos if destinos.count(destino) > 1})
    if repetidos:
        raise CatalogoInvalido(f"Destinos repetidos: {', '.join(repetidos)}.")
    return Catalogo(fuentes=fuentes, tamanos=tamanos, calidad=calidad, imagenes=imagenes)


def cargar_catalogo(ruta: Path) -> Catalogo:
    return parsear_catalogo(json.loads(ruta.read_text(encoding="utf-8")))
