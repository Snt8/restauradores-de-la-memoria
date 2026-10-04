"""
Carga idempotente del contenido inicial: crea o actualiza cada elemento por su slug y
reemplaza sus evidencias. Se puede ejecutar las veces que haga falta sin duplicar datos.
"""

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from pydantic import BaseModel
from sqlalchemy import and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.db.models import (
    ActividadModel,
    AliadoModel,
    EventoModel,
    EvidenciaModel,
    ExposicionModel,
    ObjetoMuseoModel,
    ReconocimientoModel,
)
from app.infrastructure.db.models.evidencias import PADRES_DE_EVIDENCIA
from seeds.esquema import (
    ActividadSemilla,
    AliadoSemilla,
    ArchivoDeSemillas,
    ContenidoSemilla,
    EventoSemilla,
    EvidenciaSemilla,
    ExposicionSemilla,
    ObjetoMuseoSemilla,
    ReconocimientoSemilla,
)

DIRECTORIO_POR_DEFECTO = Path(__file__).resolve().parent / "datos"


class ReferenciaInvalida(ValueError):
    """Un contenido apunta a otro (por slug) que no existe en los datos."""


@dataclass(frozen=True, slots=True)
class ContenidoInicial:
    exposiciones: ArchivoDeSemillas[ExposicionSemilla]
    objetos: ArchivoDeSemillas[ObjetoMuseoSemilla]
    eventos: ArchivoDeSemillas[EventoSemilla]
    actividades: ArchivoDeSemillas[ActividadSemilla]
    reconocimientos: ArchivoDeSemillas[ReconocimientoSemilla]
    aliados: ArchivoDeSemillas[AliadoSemilla]
    archivo: ArchivoDeSemillas[EvidenciaSemilla]


# Nombre del archivo JSON y esquema de cada campo de ContenidoInicial.
ARCHIVOS: dict[str, tuple[str, type[BaseModel]]] = {
    "exposiciones": ("exposiciones.json", ExposicionSemilla),
    "objetos": ("objetos_museo.json", ObjetoMuseoSemilla),
    "eventos": ("eventos.json", EventoSemilla),
    "actividades": ("actividades.json", ActividadSemilla),
    "reconocimientos": ("reconocimientos.json", ReconocimientoSemilla),
    "aliados": ("aliados.json", AliadoSemilla),
    "archivo": ("archivo.json", EvidenciaSemilla),
}


def leer_directorio(directorio: Path = DIRECTORIO_POR_DEFECTO) -> ContenidoInicial:
    colecciones = {
        campo: ArchivoDeSemillas[esquema].model_validate(
            json.loads((directorio / nombre).read_text(encoding="utf-8"))
        )
        for campo, (nombre, esquema) in ARCHIVOS.items()
    }
    return ContenidoInicial(**colecciones)


@dataclass(slots=True)
class Resumen:
    elementos: dict[str, int] = field(default_factory=dict)
    evidencias: int = 0


def _evidencias(archivo: ArchivoDeSemillas[Any], semillas: list[EvidenciaSemilla]):
    return [
        EvidenciaModel(
            **semilla.model_dump(exclude={"fecha"}), **semilla.fecha.model_dump(), orden=i
        )
        for i, semilla in enumerate(archivo.evidencias_de(semillas))
    ]


async def _sincronizar(
    sesion: AsyncSession,
    modelo: type[Any],
    archivo: ArchivoDeSemillas[Any],
    resumen: Resumen,
    *relaciones_extra: Any,
) -> dict[str, Any]:
    """Crea o actualiza cada elemento por slug; devuelve las filas indexadas por slug."""
    slugs = [semilla.slug for semilla in archivo.elementos]
    consulta = (
        select(modelo)
        .where(modelo.slug.in_(slugs))
        .options(selectinload(modelo.evidencias), *(selectinload(r) for r in relaciones_extra))
    )
    filas = {fila.slug: fila for fila in await sesion.scalars(consulta)}

    semilla: ContenidoSemilla
    for semilla in archivo.elementos:
        fila = filas.get(semilla.slug)
        if fila is None:
            fila = modelo(slug=semilla.slug, evidencias=[])
            sesion.add(fila)
            filas[semilla.slug] = fila
        for columna, valor in semilla.columnas().items():
            setattr(fila, columna, valor)
        fila.evidencias = _evidencias(archivo, semilla.evidencias)
        resumen.evidencias += len(fila.evidencias)

    resumen.elementos[modelo.__tablename__] = len(archivo.elementos)
    return filas


async def _vincular_exposiciones(
    objetos: ArchivoDeSemillas[ObjetoMuseoSemilla],
    filas_objetos: dict[str, ObjetoMuseoModel],
    filas_exposiciones: dict[str, ExposicionModel],
) -> None:
    for semilla in objetos.elementos:
        faltantes = set(semilla.exposiciones) - filas_exposiciones.keys()
        if faltantes:
            raise ReferenciaInvalida(
                f"El objeto '{semilla.slug}' referencia exposiciones inexistentes: "
                f"{', '.join(sorted(faltantes))}"
            )
        filas_objetos[semilla.slug].exposiciones = [
            filas_exposiciones[slug] for slug in semilla.exposiciones
        ]


async def _reemplazar_archivo_general(
    sesion: AsyncSession, archivo: ArchivoDeSemillas[EvidenciaSemilla], resumen: Resumen
) -> None:
    """Las evidencias sin contenido asociado se reemplazan en bloque (no tienen slug)."""
    sin_padre = and_(*(getattr(EvidenciaModel, fk).is_(None) for fk in PADRES_DE_EVIDENCIA))
    await sesion.execute(delete(EvidenciaModel).where(sin_padre))
    nuevas = _evidencias(archivo, archivo.elementos)
    sesion.add_all(nuevas)
    resumen.evidencias += len(nuevas)
    resumen.elementos["archivo"] = len(nuevas)


async def cargar(sesion: AsyncSession, contenido: ContenidoInicial) -> Resumen:
    """Sincroniza todo el contenido. No confirma la transacción: eso lo decide quien llama."""
    resumen = Resumen()
    exposiciones = await _sincronizar(sesion, ExposicionModel, contenido.exposiciones, resumen)
    objetos = await _sincronizar(
        sesion, ObjetoMuseoModel, contenido.objetos, resumen, ObjetoMuseoModel.exposiciones
    )
    await _vincular_exposiciones(contenido.objetos, objetos, exposiciones)
    await _sincronizar(sesion, EventoModel, contenido.eventos, resumen)
    await _sincronizar(sesion, ActividadModel, contenido.actividades, resumen)
    await _sincronizar(sesion, ReconocimientoModel, contenido.reconocimientos, resumen)
    await _sincronizar(sesion, AliadoModel, contenido.aliados, resumen)
    await _reemplazar_archivo_general(sesion, contenido.archivo, resumen)
    await sesion.flush()
    return resumen
