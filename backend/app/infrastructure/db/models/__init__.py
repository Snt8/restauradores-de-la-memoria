"""Modelos ORM. Cada modelo nuevo se importa aquí para que Alembic lo detecte."""

from app.infrastructure.db.models.actividades import ActividadModel
from app.infrastructure.db.models.aliados import AliadoModel
from app.infrastructure.db.models.eventos import EventoModel
from app.infrastructure.db.models.evidencias import EvidenciaModel
from app.infrastructure.db.models.museo import ExposicionModel, ObjetoMuseoModel, objeto_exposicion
from app.infrastructure.db.models.reconocimientos import ReconocimientoModel
from app.infrastructure.db.models.visitantes import VisitanteModel

__all__ = [
    "ActividadModel",
    "AliadoModel",
    "EventoModel",
    "EvidenciaModel",
    "ExposicionModel",
    "ObjetoMuseoModel",
    "ReconocimientoModel",
    "VisitanteModel",
    "objeto_exposicion",
]
