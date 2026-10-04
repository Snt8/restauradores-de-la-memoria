from sqlalchemy import CheckConstraint, ForeignKey, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, Relationship, mapped_column, relationship

from app.domain.evidencias import Evidencia, TipoEvidencia
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import (
    ConFechaParcial,
    ConMarcasDeTiempo,
    columna_enum,
    restricciones_fecha_parcial,
)

# Contenidos que una evidencia puede respaldar. Una FK real por cada uno (y no una asociación
# polimórfica tipo/id) para que PostgreSQL garantice la integridad referencial.
PADRES_DE_EVIDENCIA = (
    "exposicion_id",
    "objeto_id",
    "evento_id",
    "actividad_id",
    "reconocimiento_id",
    "aliado_id",
)


def _fk_padre(tabla: str) -> Mapped[int | None]:
    return mapped_column(ForeignKey(f"{tabla}.id", ondelete="CASCADE"), index=True)


class EvidenciaModel(ConFechaParcial, ConMarcasDeTiempo, Base):
    __tablename__ = "evidencias"
    __table_args__ = (
        *restricciones_fecha_parcial(),
        # Una evidencia respalda a lo sumo un contenido; sin padre queda en el archivo general.
        CheckConstraint(f"num_nonnulls({', '.join(PADRES_DE_EVIDENCIA)}) <= 1", name="un_padre"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    tipo: Mapped[TipoEvidencia] = columna_enum(TipoEvidencia, "tipo_evidencia", nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text)
    creditos: Mapped[str | None] = mapped_column(String(300))
    orden: Mapped[int] = mapped_column(SmallInteger, default=0, server_default="0")

    exposicion_id: Mapped[int | None] = _fk_padre("exposiciones")
    objeto_id: Mapped[int | None] = _fk_padre("objetos_museo")
    evento_id: Mapped[int | None] = _fk_padre("eventos")
    actividad_id: Mapped[int | None] = _fk_padre("actividades")
    reconocimiento_id: Mapped[int | None] = _fk_padre("reconocimientos")
    aliado_id: Mapped[int | None] = _fk_padre("aliados")

    def a_dominio(self) -> Evidencia:
        return Evidencia(
            id=self.id,
            tipo=self.tipo,
            url=self.url,
            titulo=self.titulo,
            descripcion=self.descripcion,
            fecha=self.fecha,
            creditos=self.creditos,
        )


def relacion_evidencias() -> Relationship[list[EvidenciaModel]]:
    """Relación padre → evidencias, idéntica para todos los contenidos que tienen evidencias."""
    return relationship(
        EvidenciaModel,
        cascade="all, delete-orphan",
        order_by=(EvidenciaModel.orden, EvidenciaModel.id),
        lazy="raise",
    )
