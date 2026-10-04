from sqlalchemy import Boolean, CheckConstraint, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.visitantes import OrigenVisitante
from app.infrastructure.db.base import Base
from app.infrastructure.db.models.columns import ConMarcasDeTiempo, columna_enum


class VisitanteModel(ConMarcasDeTiempo, Base):
    __tablename__ = "visitantes"
    __table_args__ = (
        # Ley 1581 de 2012: no se guarda ningún registro sin autorización de tratamiento de datos.
        CheckConstraint("consentimiento_datos", name="consentimiento_obligatorio"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    correo: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    institucion: Mapped[str | None] = mapped_column(String(150))
    rol: Mapped[str | None] = mapped_column(String(80))
    mensaje: Mapped[str | None] = mapped_column(Text)
    origen: Mapped[OrigenVisitante] = columna_enum(
        OrigenVisitante, "origen_visitante", nullable=False
    )
    consentimiento_datos: Mapped[bool] = mapped_column(Boolean, nullable=False)
