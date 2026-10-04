"""Columnas y restricciones reutilizadas por varios modelos ORM."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import CheckConstraint, DateTime, SmallInteger, String, func
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.shared import ANIO_MAXIMO, ANIO_MINIMO, FechaParcial


def columna_enum[E: StrEnum](enum: type[E], nombre: str, **kwargs) -> Mapped[E]:
    """
    Guarda el enum como VARCHAR + CHECK en lugar de un tipo ENUM nativo de PostgreSQL:
    agregar un valor nuevo después solo requiere cambiar el CHECK en una migración.
    """
    tipo = SqlEnum(
        enum,
        name=nombre,
        native_enum=False,
        create_constraint=True,
        length=30,
        values_callable=lambda miembros: [miembro.value for miembro in miembros],
        validate_strings=True,
    )
    return mapped_column(tipo, **kwargs)


class ConMarcasDeTiempo:
    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class ConFechaParcial:
    """Año, mes y día opcionales: la fecha con la precisión que dan las fuentes."""

    anio: Mapped[int | None] = mapped_column(SmallInteger)
    mes: Mapped[int | None] = mapped_column(SmallInteger)
    dia: Mapped[int | None] = mapped_column(SmallInteger)

    @property
    def fecha(self) -> FechaParcial:
        return FechaParcial(anio=self.anio, mes=self.mes, dia=self.dia)


def restricciones_fecha_parcial() -> tuple[CheckConstraint, ...]:
    """Las mismas reglas de FechaParcial, garantizadas también por la base de datos."""
    return (
        CheckConstraint(f"anio BETWEEN {ANIO_MINIMO} AND {ANIO_MAXIMO}", name="anio_valido"),
        CheckConstraint("mes BETWEEN 1 AND 12", name="mes_valido"),
        CheckConstraint("dia BETWEEN 1 AND 31", name="dia_valido"),
        CheckConstraint("dia IS NULL OR mes IS NOT NULL", name="dia_requiere_mes"),
        CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL", name="mes_requiere_anio_o_dia"
        ),
    )


class ConIdentidadDeContenido(ConMarcasDeTiempo):
    """Identidad común del contenido publicable: id interno, slug estable para URLs y nombre."""

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
