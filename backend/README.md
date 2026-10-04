# ⚙️ Backend: API Restauradores de la Memoria

## 📖 Introducción
API REST que gestiona la información del portal: objetos del museo, exposiciones, eventos, actividades, evidencias, aliados, reconocimientos y visitantes. Está construida con **FastAPI + SQLAlchemy 2 (async) + Alembic** sobre **PostgreSQL**.

## 🗂️ Archivos y carpetas

| Ruta | Qué hace |
|---|---|
| 📁 [`app/core/`](app/core/README.md) | Configuración de la aplicación |
| 📁 [`app/domain/`](app/domain/README.md) | Entidades y puertos (interfaces): el corazón, sin dependencias externas |
| 📁 [`app/application/`](app/application/README.md) | Casos de uso que orquestan el dominio |
| 📁 [`app/infrastructure/`](app/infrastructure/README.md) | Adaptadores: base de datos, ORM, repositorios |
| 📁 [`app/presentation/`](app/presentation/README.md) | API HTTP: routers, schemas y composición de dependencias |
| 📄 `app/main.py` | Fábrica `create_app()` que ensambla todo |
| 📁 [`alembic/`](alembic/README.md) | Migraciones de base de datos |
| 📁 [`tests/`](tests/README.md) | Pruebas unitarias y de integración |
| 📄 `pyproject.toml` | Dependencias y configuración de pytest y ruff |
| 📄 `.env.example` | Variables de entorno disponibles |

## 🎯 Problema que resuelve
Persistir y exponer de forma segura y escalable la información institucional para que el portal la consuma y, en la segunda entrega, se pueda administrar.

## 🔗 Dependencias

| Paquete | Para qué |
|---|---|
| `fastapi`, `uvicorn` | Servidor y framework HTTP |
| `sqlalchemy[asyncio]`, `asyncpg` | ORM y driver asíncrono de PostgreSQL |
| `alembic` | Migraciones versionadas |
| `pydantic-settings` | Configuración tipada desde el entorno |
| `pytest`, `pytest-asyncio`, `httpx2`, `ruff` | Pruebas y calidad (extra `dev`) |

## 🛠️ Cómo lo soluciona: Clean Architecture

```
presentation ──▶ application ──▶ domain ◀── infrastructure
 (HTTP)           (casos de uso)  (reglas)    (SQLAlchemy)
```

- Las dependencias apuntan **hacia el dominio**: el dominio no importa FastAPI ni SQLAlchemy.
- Los casos de uso dependen de **puertos** (protocolos). La infraestructura los implementa y `presentation/api/dependencies.py` los conecta (DIP).
- `create_app(settings)` permite crear instancias aisladas para pruebas.
- Se eligió **asyncpg** porque el modo async de psycopg no es compatible con el event loop por defecto de Windows.

## 💡 Ejemplos de uso

```bash
uvicorn app.main:app --reload          # servidor de desarrollo
pytest                                 # todas las pruebas
pytest -m unit                         # solo unitarias (sin base de datos)
pytest -m integration                  # solo integración (requiere docker compose up -d db)
ruff check . && ruff format .          # lint y formato
alembic revision --autogenerate -m "crear tabla eventos"
alembic upgrade head
```

| Endpoint | Descripción |
|---|---|
| `GET /api/v1/health` | Liveness: el proceso está vivo |
| `GET /api/v1/health/ready` | Readiness: comprueba la base de datos (`503` si no responde) |

## ⚠️ Nota para Windows con Control de aplicaciones (Smart App Control)
Si al importar SQLAlchemy aparece `DLL load failed ... An Application Control policy has blocked this file`, instala su versión en Python puro (misma API, sin extensiones compiladas):

```bash
pip download "sqlalchemy==<versión instalada>" --no-deps --only-binary=:all: --platform any -d .wheels
pip install --force-reinstall --no-deps .wheels/sqlalchemy-*-py3-none-any.whl
```

Afecta solo al entorno local. En CI y producción (Linux) se usa la versión compilada.
