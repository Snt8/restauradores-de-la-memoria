# 🗃️ alembic/

## 📖 Introducción
Migraciones versionadas del esquema de PostgreSQL.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `env.py` | Entorno de migraciones en modo asíncrono |
| `script.py.mako` | Plantilla de cada migración nueva |
| `versions/` | Migraciones generadas, en orden cronológico |
| `versions/20261003_2035_b270a230d569_crea_el_modelo_de_contenido_inicial.py` | Crea las 8 tablas del portal y la tabla puente `objeto_exposicion` |
| `../alembic.ini` | Configuración (logging, formato de nombres, hook de ruff) |

## 🎯 Problema que resuelve
Permite que todo el equipo y cada entorno (local, CI, producción) tengan exactamente el mismo esquema, con historial y la posibilidad de revertir cambios.

## 🔗 Dependencias
`alembic`, `sqlalchemy[asyncio]`, `asyncpg`, `app.core.config`, `app.infrastructure.db`

## 🛠️ Cómo lo soluciona
- La URL **no** se escribe en `alembic.ini`: `env.py` la toma de `Settings` o de `config.attributes["database_url"]` (lo usan las pruebas).
- `target_metadata = Base.metadata`, con todos los modelos importados desde `app.infrastructure.db.models`, habilita `--autogenerate`.
- `compare_type=True` detecta cambios de tipo de columna.
- Los nombres de archivo llevan fecha (`20261003_1530_<rev>_<slug>.py`) y se formatean con ruff al crearse.
- **Revisa siempre lo que genera `--autogenerate`.** Con enums `native_enum=False` + `create_constraint=True`, Alembic duplica el `CHECK` (uno sin nombre convencional): en la migración inicial se dejó solo el que tiene nombre (`ck_<tabla>_<tipo>`). Si en Windows el hook de ruff falla porque `ruff` no está en el `PATH`, formatea a mano con `python -m ruff format alembic/versions`.

## 💡 Ejemplos de uso

```bash
alembic revision --autogenerate -m "crear tablas del museo"
alembic upgrade head
alembic downgrade -1
alembic history
alembic check     # falla si hay cambios en los modelos sin migración
```

> 🧪 `tests/integration/test_migrations.py` verifica que las migraciones suban y bajen, y que no haya modelos sin migrar.
