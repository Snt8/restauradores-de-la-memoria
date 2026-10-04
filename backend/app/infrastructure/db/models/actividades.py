from sqlalchemy import Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.actividades import Actividad, TipoActividad
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import (
    ConFechaParcial,
    ConIdentidadDeContenido,
    columna_enum,
    restricciones_fecha_parcial,
)
from app.infrastructure.db.models.evidencias import EvidenciaModel, relacion_evidencias


class ActividadModel(ConIdentidadDeContenido, ConFechaParcial, Base):
    __tablename__ = "actividades"
    __table_args__ = (
        *restricciones_fecha_parcial(),
        # Las secciones del portal consultan por tipo y, dentro de él, por año.
        Index("ix_actividades_tipo_anio", "tipo", "anio"),
    )

    tipo: Mapped[TipoActividad] = columna_enum(TipoActividad, "tipo_actividad", nullable=False)
    lugar: Mapped[str | None] = mapped_column(String(200))
    descripcion: Mapped[str | None] = mapped_column(Text)

    evidencias: Mapped[list[EvidenciaModel]] = relacion_evidencias()

    def a_dominio(self) -> Actividad:
        return Actividad(
            id=self.id,
            slug=self.slug,
            nombre=self.nombre,
            tipo=self.tipo,
            fecha=self.fecha,
            lugar=self.lugar,
            descripcion=self.descripcion,
            evidencias=tuple(evidencia.a_dominio() for evidencia in self.evidencias),
        )
