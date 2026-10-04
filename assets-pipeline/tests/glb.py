"""Lector mínimo de .glb para verificar en las pruebas lo que escribe el generador."""

import json
import struct


def leer_glb(contenido: bytes) -> tuple[dict, bytes]:
    magic, version, largo = struct.unpack_from("<III", contenido, 0)
    assert magic == 0x46546C67, "no es un archivo glTF binario"
    assert version == 2
    assert largo == len(contenido)

    largo_json, tipo_json = struct.unpack_from("<II", contenido, 12)
    assert tipo_json == 0x4E4F534A
    documento = json.loads(contenido[20 : 20 + largo_json])

    inicio_bin = 20 + largo_json
    largo_bin, tipo_bin = struct.unpack_from("<II", contenido, inicio_bin)
    assert tipo_bin == 0x004E4942
    binario = contenido[inicio_bin + 8 : inicio_bin + 8 + largo_bin]
    return documento, binario


def leer_indices(documento: dict, binario: bytes, accesor: int) -> tuple[int, ...]:
    datos = documento["accessors"][accesor]
    vista = documento["bufferViews"][datos["bufferView"]]
    return struct.unpack_from(f"<{datos['count']}H", binario, vista["byteOffset"])
