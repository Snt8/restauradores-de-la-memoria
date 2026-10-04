from sqlalchemy import Column, Float, ForeignKey, SmallInteger, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.museo import Exposicion, ObjetoMuseo, ReferenciaExposicion, UbicacionEnSala
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import (
    ConFechaParcial,
    ConIdentidadDeContenido,
    restricciones_fecha_parcial,
)
from app.infrastructure.db.models.evidencias import EvidenciaModel, relacion_evidencias

# Un objeto puede exhibirse en varias ediciones del museo y una edición exhibe varios objetos.
objeto_exposicion = Table(
    "objeto_exposicion",
    Base.metadata,
    Column("objeto_id", ForeignKey("objetos_museo.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "exposicion_id",
        ForeignKey("exposiciones.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    ),
)


class ExposicionModel(ConIdentidadDeContenido, ConFechaParcial, Base):
    __tablename__ = "exposiciones"
    __table_args__ = restricciones_fecha_parcial()

    descripcion: Mapped[str | None] = mapped_column(Text)
    lugar: Mapped[str | None] = mapped_column(String(200))

    evidencias: Mapped[list[EvidenciaModel]] = relacion_evidencias()

    def a_dominio(self) -> Exposicion:
        return Exposicion(
            id=self.id,
            slug=self.slug,
            nombre=self.nombre,
            descripcion=self.descripcion,
            lugar=self.lugar,
            fecha=self.fecha,
            evidencias=tuple(evidencia.a_dominio() for evidencia in self.evidencias),
        )


class ObjetoMuseoModel(ConIdentidadDeContenido, ConFechaParcial, Base):
    __tablename__ = "objetos_museo"
    __table_args__ = restricciones_fecha_parcial()

    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    importancia_memoria: Mapped[str | None] = mapped_column(Text)
    foto_url: Mapped[str | None] = mapped_column(String(500))
    modelo_3d_url: Mapped[str | None] = mapped_column(String(500))
    creditos: Mapped[str | None] = mapped_column(String(300))

    # Ubicación en la sala del Museo Virtual: la escena se arma desde la base de datos.
    pos_x: Mapped[float] = mapped_column(Float, default=0, server_default="0")
    pos_y: Mapped[float] = mapped_column(Float, default=0, server_default="0")
    pos_z: Mapped[float] = mapped_column(Float, default=0, server_default="0")
    rot_y: Mapped[float] = mapped_column(Float, default=0, server_default="0")
    escala: Mapped[float] = mapped_column(Float, default=1, server_default="1")
    orden: Mapped[int] = mapped_column(SmallInteger, default=0, server_default="0")

    evidencias: Mapped[list[EvidenciaModel]] = relacion_evidencias()
    exposiciones: Mapped[list[ExposicionModel]] = relationship(
        secondary=objeto_exposicion,
        order_by=(ExposicionModel.anio, ExposicionModel.mes),
        lazy="raise",
    )

    def a_dominio(self) -> ObjetoMuseo:
        return ObjetoMuseo(
            id=self.id,
            slug=self.slug,
            nombre=self.nombre,
            descripcion=self.descripcion,
            importancia_memoria=self.importancia_memoria,
            foto_url=self.foto_url,
            modelo_3d_url=self.modelo_3d_url,
            creditos=self.creditos,
            fecha=self.fecha,
            ubicacion=UbicacionEnSala(
                x=self.pos_x, y=self.pos_y, z=self.pos_z, rotacion_y=self.rot_y, escala=self.escala
            ),
            orden=self.orden,
            exposiciones=tuple(
                ReferenciaExposicion(slug=exposicion.slug, nombre=exposicion.nombre)
                for exposicion in self.exposiciones
            ),
            evidencias=tuple(evidencia.a_dominio() for evidencia in self.evidencias),
        )
