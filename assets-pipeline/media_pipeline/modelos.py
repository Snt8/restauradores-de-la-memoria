"""
Modelos 3D PROVISIONALES para desarrollar el Museo Virtual mientras llegan los escaneos reales.

No representan objetos del colegio: son piezas neutras (una caja de archivo y una vasija)
generadas por código en formato glTF binario (.glb). Se reemplazan por los modelos que el
equipo obtenga por fotogrametría.

Uso (desde assets-pipeline/):
    python -m media_pipeline.modelos --destino ../frontend/public/models
"""

import argparse
import json
import math
import struct
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]

_FLOAT = 5126
_UNSIGNED_SHORT = 5123
_ARRAY_BUFFER = 34962
_ELEMENT_ARRAY_BUFFER = 34963
_MAGIC_GLTF = 0x46546C67
_CHUNK_JSON = 0x4E4F534A
_CHUNK_BIN = 0x004E4942

Vector = tuple[float, float, float]
Color = tuple[float, float, float]


@dataclass(frozen=True, slots=True)
class Malla:
    nombre: str
    posiciones: tuple[Vector, ...]
    normales: tuple[Vector, ...]
    indices: tuple[int, ...]
    color: Color

    def __post_init__(self) -> None:
        if len(self.posiciones) != len(self.normales):
            raise ValueError("Cada vértice necesita una normal.")
        if len(self.indices) % 3:
            raise ValueError("Los índices deben formar triángulos.")
        if self.indices and max(self.indices) >= len(self.posiciones):
            raise ValueError("Hay índices que apuntan a vértices inexistentes.")
        if len(self.posiciones) > 0xFFFF:
            raise ValueError("Demasiados vértices para índices de 16 bits.")


def caja(
    nombre: str,
    ancho: float,
    alto: float,
    fondo: float,
    color: Color,
    origen: Vector = (0.0, 0.0, 0.0),
) -> Malla:
    """Prisma rectangular cuyo centro inferior está en `origen`, con normales planas."""
    ox, oy, oz = origen
    x, z = ancho / 2, fondo / 2
    y0, y1 = oy, oy + alto
    caras: list[tuple[Vector, tuple[Vector, Vector, Vector, Vector]]] = [
        ((0, 0, 1), ((-x, y0, z), (x, y0, z), (x, y1, z), (-x, y1, z))),
        ((0, 0, -1), ((x, y0, -z), (-x, y0, -z), (-x, y1, -z), (x, y1, -z))),
        ((1, 0, 0), ((x, y0, z), (x, y0, -z), (x, y1, -z), (x, y1, z))),
        ((-1, 0, 0), ((-x, y0, -z), (-x, y0, z), (-x, y1, z), (-x, y1, -z))),
        ((0, 1, 0), ((-x, y1, z), (x, y1, z), (x, y1, -z), (-x, y1, -z))),
        ((0, -1, 0), ((-x, y0, -z), (x, y0, -z), (x, y0, z), (-x, y0, z))),
    ]
    posiciones: list[Vector] = []
    normales: list[Vector] = []
    indices: list[int] = []
    for normal, esquinas in caras:
        inicio = len(posiciones)
        posiciones.extend((px + ox, py, pz + oz) for px, py, pz in esquinas)
        normales.extend([normal] * 4)
        indices.extend((inicio, inicio + 1, inicio + 2, inicio, inicio + 2, inicio + 3))
    return Malla(nombre, tuple(posiciones), tuple(normales), tuple(indices), color)


def torno(
    nombre: str, perfil: Sequence[tuple[float, float]], segmentos: int, color: Color
) -> Malla:
    """
    Sólido de revolución: gira un perfil (radio, altura) alrededor del eje Y.
    Las normales se suavizan promediando las de los tramos vecinos del perfil.
    """
    if segmentos < 3 or len(perfil) < 2:
        raise ValueError("Se necesitan al menos 3 segmentos y 2 puntos de perfil.")

    normales_2d = [_normal_del_perfil(perfil, i) for i in range(len(perfil))]
    posiciones: list[Vector] = []
    normales: list[Vector] = []
    for paso in range(segmentos + 1):  # el último anillo repite el primero para cerrar la costura
        angulo = 2 * math.pi * paso / segmentos
        coseno, seno = math.cos(angulo), math.sin(angulo)
        for (radio, altura), (normal_radial, normal_y) in zip(perfil, normales_2d, strict=True):
            posiciones.append((radio * coseno, altura, radio * seno))
            normales.append((normal_radial * coseno, normal_y, normal_radial * seno))

    puntos = len(perfil)
    indices: list[int] = []
    for paso in range(segmentos):
        for i in range(puntos - 1):
            a = paso * puntos + i
            b = a + puntos
            indices.extend((a, a + 1, b, b, a + 1, b + 1))
    return Malla(nombre, tuple(posiciones), tuple(normales), tuple(indices), color)


def _normal_del_perfil(perfil: Sequence[tuple[float, float]], i: int) -> tuple[float, float]:
    vecinos = [j for j in (i - 1, i) if 0 <= j < len(perfil) - 1]
    suma_r = suma_y = 0.0
    for j in vecinos:
        (r0, y0), (r1, y1) = perfil[j], perfil[j + 1]
        # Perpendicular hacia afuera del tramo (dr, dy) → (dy, -dr).
        suma_r += y1 - y0
        suma_y += -(r1 - r0)
    largo = math.hypot(suma_r, suma_y) or 1.0
    return suma_r / largo, suma_y / largo


def escribir_glb(mallas: Sequence[Malla], generador: str = "restauradores-assets") -> bytes:
    """Serializa las mallas en un único glTF 2.0 binario (un nodo y un material por malla)."""
    binario = bytearray()
    vistas: list[dict] = []
    accesores: list[dict] = []

    def agregar_vista(datos: bytes, objetivo: int) -> int:
        binario.extend(b"\x00" * (-len(binario) % 4))  # cada vista empieza alineada a 4 bytes
        vistas.append(
            {"buffer": 0, "byteOffset": len(binario), "byteLength": len(datos), "target": objetivo}
        )
        binario.extend(datos)
        return len(vistas) - 1

    def agregar_vectores(vectores: Sequence[Vector], con_limites: bool) -> int:
        datos = b"".join(struct.pack("<3f", *vector) for vector in vectores)
        accesor = {
            "bufferView": agregar_vista(datos, _ARRAY_BUFFER),
            "componentType": _FLOAT,
            "count": len(vectores),
            "type": "VEC3",
        }
        if con_limites:  # glTF exige min/max en POSITION
            accesor["min"] = [min(v[eje] for v in vectores) for eje in range(3)]
            accesor["max"] = [max(v[eje] for v in vectores) for eje in range(3)]
        accesores.append(accesor)
        return len(accesores) - 1

    def agregar_indices(indices: Sequence[int]) -> int:
        datos = struct.pack(f"<{len(indices)}H", *indices)
        accesores.append(
            {
                "bufferView": agregar_vista(datos, _ELEMENT_ARRAY_BUFFER),
                "componentType": _UNSIGNED_SHORT,
                "count": len(indices),
                "type": "SCALAR",
            }
        )
        return len(accesores) - 1

    mallas_gltf, materiales, nodos = [], [], []
    for i, malla in enumerate(mallas):
        primitiva = {
            "attributes": {
                "POSITION": agregar_vectores(malla.posiciones, con_limites=True),
                "NORMAL": agregar_vectores(malla.normales, con_limites=False),
            },
            "indices": agregar_indices(malla.indices),
            "material": i,
        }
        mallas_gltf.append({"name": malla.nombre, "primitives": [primitiva]})
        materiales.append(
            {
                "name": malla.nombre,
                "pbrMetallicRoughness": {
                    "baseColorFactor": [*malla.color, 1.0],
                    "metallicFactor": 0.0,
                    "roughnessFactor": 0.85,
                },
                # La vasija es abierta: sin doble cara su interior se vería transparente.
                "doubleSided": True,
            }
        )
        nodos.append({"name": malla.nombre, "mesh": i})
    binario.extend(b"\x00" * (-len(binario) % 4))

    documento = {
        "asset": {"version": "2.0", "generator": generador},
        "scene": 0,
        "scenes": [{"nodes": list(range(len(nodos)))}],
        "nodes": nodos,
        "meshes": mallas_gltf,
        "materials": materiales,
        "buffers": [{"byteLength": len(binario)}],
        "bufferViews": vistas,
        "accessors": accesores,
    }
    json_bytes = json.dumps(documento, separators=(",", ":")).encode("utf-8")
    json_bytes += b" " * (-len(json_bytes) % 4)

    largo_total = 12 + 8 + len(json_bytes) + 8 + len(binario)
    return b"".join(
        (
            struct.pack("<III", _MAGIC_GLTF, 2, largo_total),
            struct.pack("<II", len(json_bytes), _CHUNK_JSON),
            json_bytes,
            struct.pack("<II", len(binario), _CHUNK_BIN),
            bytes(binario),
        )
    )


def caja_de_archivo() -> list[Malla]:
    carton = (0.62, 0.45, 0.28)
    tapa = (0.48, 0.33, 0.2)
    return [
        caja("cuerpo", 0.42, 0.26, 0.3, carton),
        caja("tapa", 0.44, 0.06, 0.32, tapa, origen=(0.0, 0.24, 0.0)),
        caja("etiqueta", 0.16, 0.08, 0.005, (0.93, 0.9, 0.82), origen=(0.0, 0.1, 0.1525)),
    ]


def vasija() -> list[Malla]:
    perfil = [
        (0.0, 0.0),
        (0.1, 0.0),
        (0.16, 0.08),
        (0.19, 0.18),
        (0.17, 0.3),
        (0.09, 0.4),
        (0.07, 0.46),
        (0.1, 0.5),
    ]
    return [torno("vasija", perfil, segmentos=40, color=(0.7, 0.36, 0.22))]


MODELOS_PROVISIONALES = {
    "pieza-prueba-caja.glb": caja_de_archivo,
    "pieza-prueba-vasija.glb": vasija,
}


def generar(destino: Path) -> list[Path]:
    destino.mkdir(parents=True, exist_ok=True)
    escritos = []
    for nombre, construir in MODELOS_PROVISIONALES.items():
        ruta = destino / nombre
        ruta.write_bytes(escribir_glb(construir(), generador="restauradores-assets (provisional)"))
        escritos.append(ruta)
    return escritos


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Genera los modelos 3D provisionales del museo.")
    parser.add_argument(
        "--destino", type=Path, default=RAIZ.parent / "frontend" / "public" / "models"
    )
    args = parser.parse_args(argv)
    for ruta in generar(args.destino):
        print(f"Modelo provisional escrito: {ruta}")


if __name__ == "__main__":
    main()
