from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.foro import (
    LONGITUD_AUTOR,
    LONGITUD_TITULO,
    CategoriaForo,
    Comentario,
    Publicacion,
    ValorVoto,
)
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import ConMarcasDeTiempo, columna_enum


def _contador() -> Mapped[int]:
    return mapped_column(Integer, nullable=False, default=0, server_default="0")


def _no_vacio(columna: str) -> CheckConstraint:
    return CheckConstraint(f"length(btrim({columna})) > 0", name=f"{columna}_no_vacio")


class PublicacionForoModel(ConMarcasDeTiempo, Base):
    __tablename__ = "publicaciones_foro"
    __table_args__ = (
        _no_vacio("titulo"),
        _no_vacio("contenido"),
        _no_vacio("autor"),
        CheckConstraint("comentarios >= 0", name="comentarios_no_negativos"),
        Index("ix_publicaciones_foro_categoria_creado_en", "categoria", "creado_en"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    categoria: Mapped[CategoriaForo] = columna_enum(CategoriaForo, "categoria_foro", nullable=False)
    titulo: Mapped[str] = mapped_column(String(LONGITUD_TITULO), nullable=False)
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    autor: Mapped[str] = mapped_column(String(LONGITUD_AUTOR), nullable=False)
    # Contadores desnormalizados: el muro se ordena por ellos sin agregar votos en cada consulta.
    puntaje: Mapped[int] = _contador()
    comentarios: Mapped[int] = _contador()

    def a_dominio(self, mi_voto: int | None = None) -> Publicacion:
        return Publicacion(
            id=self.id,
            categoria=self.categoria,
            titulo=self.titulo,
            contenido=self.contenido,
            autor=self.autor,
            creado_en=self.creado_en,
            puntaje=self.puntaje,
            comentarios=self.comentarios,
            mi_voto=ValorVoto(mi_voto or 0),
        )


class ComentarioForoModel(ConMarcasDeTiempo, Base):
    __tablename__ = "comentarios_foro"
    __table_args__ = (_no_vacio("contenido"), _no_vacio("autor"))

    id: Mapped[int] = mapped_column(primary_key=True)
    publicacion_id: Mapped[int] = mapped_column(
        ForeignKey("publicaciones_foro.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Respuesta a otro comentario; al borrar el comentario padre se borra todo su hilo.
    padre_id: Mapped[int | None] = mapped_column(
        ForeignKey("comentarios_foro.id", ondelete="CASCADE"), index=True
    )
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    autor: Mapped[str] = mapped_column(String(LONGITUD_AUTOR), nullable=False)
    puntaje: Mapped[int] = _contador()

    def a_dominio(self, mi_voto: int | None = None) -> Comentario:
        return Comentario(
            id=self.id,
            publicacion_id=self.publicacion_id,
            padre_id=self.padre_id,
            contenido=self.contenido,
            autor=self.autor,
            creado_en=self.creado_en,
            puntaje=self.puntaje,
            mi_voto=ValorVoto(mi_voto or 0),
        )


class _ConVoto:
    """Un voto anónimo: el votante es un UUID que el navegador genera y conserva."""

    votante: Mapped[UUID] = mapped_column(primary_key=True)
    valor: Mapped[int] = mapped_column(SmallInteger, nullable=False)


def _valor_valido() -> CheckConstraint:
    # El «sin voto» no se guarda: retirar el voto borra la fila.
    return CheckConstraint("valor IN (-1, 1)", name="valor_valido")


class VotoPublicacionModel(_ConVoto, Base):
    __tablename__ = "votos_publicaciones"
    __table_args__ = (_valor_valido(),)

    publicacion_id: Mapped[int] = mapped_column(
        ForeignKey("publicaciones_foro.id", ondelete="CASCADE"), primary_key=True
    )


class VotoComentarioModel(_ConVoto, Base):
    __tablename__ = "votos_comentarios"
    __table_args__ = (_valor_valido(),)

    comentario_id: Mapped[int] = mapped_column(
        ForeignKey("comentarios_foro.id", ondelete="CASCADE"), primary_key=True
    )
