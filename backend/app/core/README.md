# 🔧 app/core/

## 📖 Introducción
Elementos transversales que no pertenecen a ninguna capa de negocio. Por ahora, la configuración.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `config.py` | Clase `Settings` y función `get_settings()` |

## 🎯 Problema que resuelve
Evita valores mágicos dispersos (URLs, orígenes CORS, tiempos límite) y permite cambiar el comportamiento por entorno sin tocar código.

## 🔗 Dependencias
`pydantic-settings`

## 🛠️ Cómo lo soluciona
- **`Settings`** lee las variables de entorno o el archivo `.env`, valida tipos y restricciones (por ejemplo, `db_health_timeout_seconds > 0`) e ignora variables desconocidas.
- **`get_settings()`** cachea una única instancia por proceso (`lru_cache`).

| Variable | Por defecto | Descripción |
|---|---|---|
| `ENVIRONMENT` | `development` | `development`, `test` o `production` (en producción se oculta `/docs`) |
| `DATABASE_URL` | PostgreSQL local en `:5433` | Cadena de conexión `postgresql+asyncpg://...` |
| `DATABASE_ECHO` | `false` | Registra el SQL ejecutado |
| `DB_HEALTH_TIMEOUT_SECONDS` | `2` | Tiempo máximo del chequeo de la base de datos |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Orígenes permitidos (lista JSON) |

## 💡 Ejemplos de uso

```python
from app.core.config import Settings, get_settings

settings = get_settings()  # en la app
test_settings = Settings(_env_file=None, environment="test")  # en pruebas, sin leer .env
```
