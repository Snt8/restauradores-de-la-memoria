# 🏗️ app/infrastructure/

## 📖 Introducción
Adaptadores que implementan los puertos del dominio con tecnología concreta (SQLAlchemy y PostgreSQL).

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `db/base.py` | `Base` declarativa con convención de nombres para constraints |
| `db/database.py` | Clase `Database`: motor async, fábrica de sesiones y cierre |
| `db/health.py` | `SqlAlchemyDatabaseProbe`, que implementa `DatabaseProbe` |
| `db/models/__init__.py` | Registro de modelos ORM (Alembic los descubre desde aquí) |

## 🎯 Problema que resuelve
Aísla los detalles de persistencia: cambiar de driver o de motor solo afecta a esta capa.

## 🔗 Dependencias
`sqlalchemy[asyncio]`, `asyncpg`, `app.domain`

## 🛠️ Cómo lo soluciona
- **`Database(url, echo=False)`** crea un `AsyncEngine` con `pool_pre_ping`, que detecta conexiones caídas antes de usarlas. `session()` entrega una sesión por petición y la cierra siempre. `dispose()` libera el pool al apagar la app.
- **`NAMING_CONVENTION`** hace que Alembic genere nombres deterministas (`pk_eventos`, `fk_evidencias_evento_id_eventos`...) y las migraciones sean estables.
- **`SqlAlchemyDatabaseProbe.ping()`** ejecuta `SELECT 1`. Si hay un error de SQLAlchemy o de red devuelve `False`, nunca lanza excepción.

## 💡 Ejemplos de uso

Registrar un modelo nuevo:

```python
# db/models/evento.py
class EventoModel(Base):
    __tablename__ = "eventos"
    id: Mapped[int] = mapped_column(primary_key=True)


# db/models/__init__.py
from .evento import EventoModel  # noqa: F401
```

Usar una sesión:

```python
async for session in database.session():
    result = await session.execute(select(EventoModel))
```
