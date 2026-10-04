# 🐳 docker/

## 📖 Introducción
Configuración auxiliar de los contenedores de desarrollo. El servicio se define en el `docker-compose.yml` de la raíz.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `postgres/init/01-create-test-database.sql` | Crea la base `restauradores_test` para las pruebas de integración |

## 🎯 Problema que resuelve
Las pruebas de integración necesitan una base de datos real pero **aislada** de los datos de desarrollo, y todo el equipo debe tener el mismo entorno sin instalar PostgreSQL a mano.

## 🔗 Dependencias
- Docker Desktop
- Imagen `postgres:18-alpine`

## 🛠️ Cómo lo soluciona
PostgreSQL ejecuta automáticamente los scripts de `/docker-entrypoint-initdb.d` **solo la primera vez** que se crea el volumen `pgdata`. Ahí se crea la base de pruebas junto a la de desarrollo.

## 💡 Ejemplos de uso

```bash
docker compose up -d db          # levantar PostgreSQL en localhost:5433
docker compose logs -f db        # ver logs
docker compose down -v           # borrar todo y reinicializar (vuelve a correr los scripts)
```

> ⚠️ `down -v` elimina el volumen y todos los datos locales.
