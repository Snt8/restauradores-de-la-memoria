from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.aliados import Aliado
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import ConIdentidadDeContenido
from app.infrastructure.db.models.evidencias import EvidenciaModel, relacion_evidencias


class AliadoModel(ConIdentidadDeContenido, Base):
    __tablename__ = "aliados"

    tipo: Mapped[str | None] = mapped_column(String(100))
    descripcion: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(String(500))
    sitio_web: Mapped[str | None] = mapped_column(String(500))

    evidencias: Mapped[list[EvidenciaModel]] = relacion_evidencias()

    def a_dominio(self) -> Aliado:
        return Aliado(
            id=self.id,
            slug=self.slug,
            nombre=self.nombre,
            tipo=self.tipo,
            descripcion=self.descripcion,
            logo_url=self.logo_url,
            sitio_web=self.sitio_web,
            evidencias=tuple(evidencia.a_dominio() for evidencia in self.evidencias),
        )
