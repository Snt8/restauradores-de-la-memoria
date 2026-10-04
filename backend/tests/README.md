# 🧪 tests/

## 📖 Introducción
Pruebas del backend, separadas en **unitarias** e **integración**. Regla del proyecto: nada entra al repositorio sin pruebas.

## 🗂️ Archivos

| Archivo | Tipo | Qué prueba |
|---|---|---|
| `conftest.py` | — | Fixtures: `test_database_url`, `make_settings`, `client` |
| `unit/test_check_readiness.py` | 🟢 unit | Caso de uso con dobles: arriba, abajo y tiempo límite |
| `unit/test_config.py` | 🟢 unit | Lectura del entorno y validaciones de `Settings` |
| `unit/test_readiness_schema.py` | 🟢 unit | Traducción de dominio a respuesta HTTP |
| `integration/test_health_api.py` | 🔵 integration | Endpoints reales, CORS, `/docs` oculto en producción |
| `integration/test_database_probe.py` | 🔵 integration | Probe y sesiones contra PostgreSQL real |
| `integration/test_migrations.py` | 🔵 integration | Migraciones arriba y abajo, y `alembic check` |

## 🎯 Problema que resuelve
Garantiza que cada capa funcione aislada (unit) y que todas juntas funcionen con PostgreSQL y HTTP reales (integration).

## 🔗 Dependencias
`pytest`, `pytest-asyncio`, `httpx2` (para el `TestClient`) y PostgreSQL de `docker compose` para la integración.

## 🛠️ Cómo lo soluciona
- **Marcadores** `unit` e `integration` (con `--strict-markers`) para correr cada grupo por separado.
- **Base de datos aislada:** `restauradores_test`, configurable con `TEST_DATABASE_URL`.
- **`make_settings(**overrides)`** crea configuración sin leer el `.env` del desarrollador, lo que da pruebas reproducibles.
- **`client`** levanta la app con su ciclo de vida completo (`lifespan`).
- **Un solo event loop por sesión** (`asyncio_default_*_loop_scope = "session"`) evita errores de asyncpg con conexiones entre loops.

## 💡 Ejemplos de uso

```bash
pytest                    # todo
pytest -m unit            # rápido, sin base de datos
pytest -m integration     # requiere: docker compose up -d db
pytest -k readiness -v    # filtrar por nombre
```

```python
pytestmark = pytest.mark.integration


def test_algo(client):
    assert client.get("/api/v1/health").status_code == 200
```
