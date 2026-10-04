from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.reconocimientos import Reconocimiento
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import (
    ConFechaParcial,
    ConIdentidadDeContenido,
    restricciones_fecha_parcial,
)
from app.infrastructure.db.models.evidencias import EvidenciaModel, relacion_evidencias


class ReconocimientoModel(ConIdentidadDeContenido, ConFechaParcial, Base):
    __tablename__ = "reconocimientos"
    __table_args__ = restricciones_fecha_parcial()

    otorgante: Mapped[str | None] = mapped_column(String(200))
    descripcion: Mapped[str | None] = mapped_column(Text)

    evidencias: Mapped[list[EvidenciaModel]] = relacion_evidencias()

    def a_dominio(self) -> Reconocimiento:
        return Reconocimiento(
            id=self.id,
            slug=self.slug,
            nombre=self.nombre,
            otorgante=self.otorgante,
            fecha=self.fecha,
            descripcion=self.descripcion,
            evidencias=tuple(evidencia.a_dominio() for evidencia in self.evidencias),
        )
