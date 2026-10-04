"""Conceptos de dominio compartidos por todas las entidades del portal."""

import calendar
from dataclasses import dataclass
from typing import ClassVar

ANIO_MINIMO = 1900
ANIO_MAXIMO = 2100
# Año bisiesto de referencia para validar fechas recurrentes (sin año), p. ej. el 29 de febrero.
_ANIO_BISIESTO = 2000


class ErrorDeDominio(Exception):
    """Base de los errores que expresan reglas de negocio."""


class EntidadNoEncontrada(ErrorDeDominio):
    def __init__(self, entidad: str, clave: str) -> None:
        super().__init__(f"No se encontró '{clave}' en {entidad}.")
        self.entidad = entidad
        self.clave = clave


class FechaInvalida(ErrorDeDominio, ValueError):
    """La combinación de año, mes y día no forma una fecha válida."""


@dataclass(frozen=True, slots=True)
class FechaParcial:
    """
    Fecha con la precisión que realmente tienen las fuentes del proyecto.

    Combinaciones válidas:
    - sin datos (fecha por confirmar)
    - solo año: «2022»
    - año y mes: «octubre de 2023»
    - fecha completa: «22 de octubre de 2025»
    - día y mes sin año: fecha conmemorativa que se repite cada año («9 de abril»)
    """

    anio: int | None = None
    mes: int | None = None
    dia: int | None = None

    def __post_init__(self) -> None:
        if self.anio is not None and not ANIO_MINIMO <= self.anio <= ANIO_MAXIMO:
            raise FechaInvalida(f"El año debe estar entre {ANIO_MINIMO} y {ANIO_MAXIMO}.")
        if self.mes is not None and not 1 <= self.mes <= 12:
            raise FechaInvalida("El mes debe estar entre 1 y 12.")
        if self.dia is not None:
            if self.mes is None:
                raise FechaInvalida("El día requiere el mes.")
            ultimo_dia = calendar.monthrange(self.anio or _ANIO_BISIESTO, self.mes)[1]
            if not 1 <= self.dia <= ultimo_dia:
                raise FechaInvalida(f"El mes {self.mes} no tiene día {self.dia}.")
        if self.anio is None and self.mes is not None and self.dia is None:
            raise FechaInvalida("Un mes sin año ni día no identifica una fecha.")

    @property
    def es_recurrente(self) -> bool:
        """True para conmemoraciones que se repiten cada año (día y mes, sin año)."""
        return self.anio is None and self.dia is not None

    @property
    def por_confirmar(self) -> bool:
        return self.anio is None and self.mes is None


@dataclass(frozen=True, slots=True)
class Paginacion:
    LIMITE_MAXIMO: ClassVar[int] = 100

    limite: int = 50
    desplazamiento: int = 0

    def __post_init__(self) -> None:
        if not 1 <= self.limite <= self.LIMITE_MAXIMO:
            raise ValueError(f"El límite debe estar entre 1 y {self.LIMITE_MAXIMO}.")
        if self.desplazamiento < 0:
            raise ValueError("El desplazamiento no puede ser negativo.")


@dataclass(frozen=True, slots=True)
class Pagina[T]:
    elementos: tuple[T, ...]
    total: int
    paginacion: Paginacion


@dataclass(frozen=True, slots=True)
class SinFiltros:
    """Filtros de las colecciones que no admiten ninguno."""
