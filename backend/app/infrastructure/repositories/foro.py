"""Adaptador de RepositorioForo sobre SQLAlchemy y PostgreSQL."""

from dataclasses import dataclass
from typing import Any
from uuid import UUID

from sqlalchemy import Float, Select, and_, cast, delete, func, null, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.domain.foro import (
    Comentario,
    FiltrosForo,
    NuevaPublicacion,
    NuevoComentario,
    ObjetivoVoto,
    OrdenForo,
    Publicacion,
    ResultadoVoto,
    ValorVoto,
    Voto,
)
from app.domain.shared import Pagina, Paginacion
from app.infrastructure.db.models import (
    ComentarioForoModel,
    PublicacionForoModel,
    VotoComentarioModel,
    VotoPublicacionModel,
)
from app.infrastructure.repositories.base import condicion_si

P = PublicacionForoModel
C = ComentarioForoModel

# «Populares»: los votos y comentarios suman, pero cada hora de antigüedad resta visibilidad,
# así lo nuevo con actividad sube y lo viejo deja espacio (inspirado en el «hot» de Reddit).
_HORAS = cast(func.extract("epoch", func.now() - P.creado_en), Float) / 3600
_RELEVANCIA = (P.puntaje + 2 * P.comentarios + 1) / func.power(_HORAS + 2, 1.5)

ORDENES: dict[OrdenForo, tuple[Any, ...]] = {
    OrdenForo.POPULARES: (_RELEVANCIA.desc(), P.creado_en.desc(), P.id.desc()),
    OrdenForo.RECIENTES: (P.creado_en.desc(), P.id.desc()),
    OrdenForo.MEJORES: (P.puntaje.desc(), P.creado_en.desc(), P.id.desc()),
}


@dataclass(frozen=True, slots=True)
class _TablaDeVotos:
    """Dónde viven los votos de cada tipo de objetivo y qué fila acumula su puntaje."""

    objetivo: type[PublicacionForoModel] | type[ComentarioForoModel]
    voto: type[VotoPublicacionModel] | type[VotoComentarioModel]
    clave: InstrumentedAttribute[int]


VOTOS = {
    ObjetivoVoto.PUBLICACION: _TablaDeVotos(
        PublicacionForoModel, VotoPublicacionModel, VotoPublicacionModel.publicacion_id
    ),
    ObjetivoVoto.COMENTARIO: _TablaDeVotos(
        ComentarioForoModel, VotoComentarioModel, VotoComentarioModel.comentario_id
    ),
}


def _con_mi_voto(consulta: Select[Any], tabla: _TablaDeVotos, votante: UUID | None) -> Select[Any]:
    """Agrega el voto de quien consulta como segunda columna (NULL si no votó o es anónimo)."""
    if votante is None:
        return consulta.add_columns(null())
    return consulta.add_columns(tabla.voto.valor).outerjoin(
        tabla.voto,
        and_(tabla.clave == tabla.objetivo.id, tabla.voto.votante == votante),
    )


class RepositorioForoSqlAlchemy:
    def __init__(self, sesion: AsyncSession) -> None:
        self._sesion = sesion

    async def listar(self, filtros: FiltrosForo, paginacion: Paginacion) -> Pagina[Publicacion]:
        condiciones = condicion_si(P.categoria, filtros.categoria)
        total = await self._sesion.scalar(select(func.count()).select_from(P).where(*condiciones))
        consulta = _con_mi_voto(
            select(P).where(*condiciones), VOTOS[ObjetivoVoto.PUBLICACION], filtros.votante
        )
        filas = await self._sesion.execute(
            consulta.order_by(*ORDENES[filtros.orden])
            .limit(paginacion.limite)
            .offset(paginacion.desplazamiento)
        )
        elementos = tuple(fila.a_dominio(voto) for fila, voto in filas)
        return Pagina(elementos=elementos, total=total or 0, paginacion=paginacion)

    async def obtener(self, publicacion_id: int, votante: UUID | None) -> Publicacion | None:
        consulta = _con_mi_voto(
            select(P).where(P.id == publicacion_id), VOTOS[ObjetivoVoto.PUBLICACION], votante
        )
        fila = (await self._sesion.execute(consulta)).first()
        return None if fila is None else fila[0].a_dominio(fila[1])

    async def publicar(self, publicacion: NuevaPublicacion) -> Publicacion:
        fila = P(
            categoria=publicacion.categoria,
            titulo=publicacion.titulo,
            contenido=publicacion.contenido,
            autor=publicacion.autor,
        )
        self._sesion.add(fila)
        await self._sesion.commit()
        await self._sesion.refresh(fila)
        return fila.a_dominio()

    async def comentarios(
        self, publicacion_id: int, votante: UUID | None
    ) -> tuple[Comentario, ...]:
        consulta = _con_mi_voto(
            select(C).where(C.publicacion_id == publicacion_id),
            VOTOS[ObjetivoVoto.COMENTARIO],
            votante,
        )
        filas = await self._sesion.execute(consulta.order_by(C.creado_en, C.id))
        return tuple(fila.a_dominio(voto) for fila, voto in filas)

    async def publicacion_de_comentario(self, comentario_id: int) -> int | None:
        return await self._sesion.scalar(select(C.publicacion_id).where(C.id == comentario_id))

    async def comentar(self, comentario: NuevoComentario) -> Comentario:
        fila = C(
            publicacion_id=comentario.publicacion_id,
            padre_id=comentario.padre_id,
            contenido=comentario.contenido,
            autor=comentario.autor,
        )
        self._sesion.add(fila)
        # El contador se incrementa en la misma transacción que el comentario.
        await self._sesion.execute(
            update(P).where(P.id == comentario.publicacion_id).values(comentarios=P.comentarios + 1)
        )
        await self._sesion.commit()
        await self._sesion.refresh(fila)
        return fila.a_dominio()

    async def votar(self, voto: Voto) -> ResultadoVoto | None:
        tabla = VOTOS[voto.objetivo]
        # Bloquear la fila del objetivo serializa los votos simultáneos sobre el mismo elemento,
        # así el puntaje recalculado siempre coincide con la suma real de votos.
        objetivo = await self._sesion.get(tabla.objetivo, voto.objetivo_id, with_for_update=True)
        if objetivo is None:
            return None

        este_voto = and_(tabla.clave == voto.objetivo_id, tabla.voto.votante == voto.votante)
        if voto.valor is ValorVoto.SIN_VOTO:
            await self._sesion.execute(delete(tabla.voto).where(este_voto))
        else:
            await self._sesion.execute(
                insert(tabla.voto)
                .values(
                    {
                        tabla.clave.key: voto.objetivo_id,
                        "votante": voto.votante,
                        "valor": int(voto.valor),
                    }
                )
                .on_conflict_do_update(
                    index_elements=[tabla.clave.key, "votante"], set_={"valor": int(voto.valor)}
                )
            )

        suma = select(func.coalesce(func.sum(tabla.voto.valor), 0)).where(
            tabla.clave == voto.objetivo_id
        )
        objetivo.puntaje = await self._sesion.scalar(suma) or 0
        await self._sesion.commit()
        return ResultadoVoto(puntaje=objetivo.puntaje, mi_voto=voto.valor)
