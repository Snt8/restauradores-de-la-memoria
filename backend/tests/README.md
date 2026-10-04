# 🧪 tests/

## 📖 Introducción

Pruebas del backend, separadas en **unitarias** e **integración**. Regla del proyecto: nada entra al repositorio sin pruebas.

## 🗂️ Archivos

| Archivo                                | Tipo           | Qué prueba                                                                 |
| -------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| `conftest.py`                          | —              | Fixtures: settings, `client`, base migrada, `bd_limpia`, `sesion`          |
| `datos.py`                             | —              | `contenido(...)` y `foto(...)`: arman datos de prueba con el cargador real |
| `unit/test_dominio_compartido.py`      | 🟢 unit        | `FechaParcial`, `Paginacion`, `EntidadNoEncontrada`                        |
| `unit/test_casos_de_uso.py`            | 🟢 unit        | Casos de uso con repositorios en memoria y reglas de visitantes            |
| `unit/test_esquemas_api.py`            | 🟢 unit        | Validación de la entrada de visitantes y traducción de páginas             |
| `unit/test_semillas.py`                | 🟢 unit        | El contenido real es válido, y sus imágenes y modelos 3D existen           |
| `unit/test_check_readiness.py`         | 🟢 unit        | Caso de uso de salud: arriba, abajo y tiempo límite                        |
| `unit/test_config.py`                  | 🟢 unit        | Lectura del entorno y validaciones de `Settings`                           |
| `unit/test_readiness_schema.py`        | 🟢 unit        | Traducción de dominio a respuesta HTTP                                     |
| `integration/test_repositorios.py`     | 🔵 integration | Orden cronológico, filtros, paginación, precargas y galería en PostgreSQL  |
| `integration/test_cargador.py`         | 🔵 integration | Carga idempotente, actualización por slug, referencias y la CLI            |
| `integration/test_restricciones_bd.py` | 🔵 integration | `CHECK`, `UNIQUE` y FKs protegen los datos aunque se escriba con SQL       |
| `integration/test_api_contenido.py`    | 🔵 integration | Endpoints de lectura: paginación, filtros, detalle, `404` y `422`          |
| `integration/test_api_visitantes.py`   | 🔵 integration | `POST /visitantes`: registro, privacidad y validaciones                    |
| `integration/test_health_api.py`       | 🔵 integration | Endpoints de salud, CORS, `/docs` oculto en producción                     |
| `integration/test_database_probe.py`   | 🔵 integration | Probe y sesiones contra PostgreSQL real                                    |
| `integration/test_migrations.py`       | 🔵 integration | Migraciones arriba y abajo, y `alembic check`                              |

## 🎯 Problema que resuelve

Garantiza que cada capa funcione aislada (unit) y que todas juntas funcionen con PostgreSQL y HTTP reales (integration).

## 🔗 Dependencias

`pytest`, `pytest-asyncio`, `httpx2` (para el `TestClient`) y PostgreSQL de `docker compose` para la integración.

## 🛠️ Cómo lo soluciona

- **Marcadores** `unit` e `integration` (con `--strict-markers`) para correr cada grupo por separado.
- **Base de datos aislada:** `restauradores_test`, configurable con `TEST_DATABASE_URL`. Se migra una vez por sesión (`esquema_migrado`) y `bd_limpia` la vacía con `TRUNCATE ... RESTART IDENTITY` antes de cada prueba que la usa.
- **Datos de prueba con el código de producción:** `contenido(eventos=[...])` arma un `ContenidoInicial` y lo carga con el mismo `cargar()` que usa `python -m seeds.load`.
- **`make_settings(**overrides)`** crea configuración sin leer el `.env` del desarrollador.
- **Un solo event loop por sesión** evita errores de asyncpg con conexiones entre loops.

## 💡 Ejemplos de uso

```bash
pytest                    # todo
pytest -m unit            # rápido, sin base de datos
pytest -m integration     # requiere: docker compose up -d db
pytest -k galeria -v      # filtrar por nombre
```

```python
pytestmark = pytest.mark.integration


async def test_algo(sesion, client):
    await cargar(sesion, contenido(eventos=[{"slug": "e", "nombre": "E", "tipo": "evento"}]))
    await sesion.commit()
    assert client.get("/api/v1/eventos").json()["total"] == 1
```
