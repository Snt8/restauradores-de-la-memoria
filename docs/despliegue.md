# 🚀 Despliegue en Render

## 📖 Introducción

El portal se publica en Render con tres piezas, definidas en [`render.yaml`](../render.yaml):

| Servicio               | Tipo                 | Qué es                                                   |
| ---------------------- | -------------------- | -------------------------------------------------------- |
| `restauradores-db`     | PostgreSQL           | Base de datos                                            |
| `restauradores-api`    | Web Service (Python) | API FastAPI: migra, carga el contenido y arranca uvicorn |
| `restauradores-portal` | Static Site          | El build de Vite (React, imágenes y modelos 3D)          |

## 🔐 Variables de entorno

| Servicio | Variable            | Valor                                                        | ¿Secreta? |
| -------- | ------------------- | ------------------------------------------------------------ | --------- |
| API      | `DATABASE_URL`      | Automática: la conecta el Blueprint desde `restauradores-db` | **Sí**    |
| API      | `CORS_ORIGINS`      | `["https://restauradores-portal.onrender.com"]` (lista JSON) | No        |
| API      | `ENVIRONMENT`       | `production` (ya en el Blueprint; oculta `/docs`)            | No        |
| API      | `PYTHON_VERSION`    | `3.13.5` (ya en el Blueprint)                                | No        |
| Portal   | `VITE_API_BASE_URL` | `https://restauradores-api.onrender.com/api/v1`              | No        |
| Portal   | `NODE_VERSION`      | `24` (ya en el Blueprint)                                    | No        |

- El **único secreto es `DATABASE_URL`**, y no hay que escribirlo: Render lo genera y lo inyecta. No lo copies en ningún archivo ni chat.
- La API acepta la URL tal como la entrega Render (`postgresql://…`) y la convierte a `postgresql+asyncpg://…`.
- `VITE_API_BASE_URL` se usa **al compilar**: si la cambias, vuelve a desplegar el portal.
- Hoy no hay más secretos porque la primera entrega no tiene inicio de sesión. Cuando llegue el panel de administración (entrega 2) se sumará uno para firmar sesiones (por ejemplo `JWT_SECRET`).

## 🛠️ Pasos

1. Fusiona el PR en `main` y confirma que la CI está en verde.
2. En Render: **New → Blueprint**, conecta el repositorio y elige la rama `main`.
3. Render pide las variables marcadas `sync: false`. Si los nombres de los servicios quedan libres, las URL serán las de la tabla. Si Render les agrega un sufijo, usa las URL reales.
4. **Apply**. Render crea la base, la API y el portal.
5. Verifica:
   - `https://restauradores-api.onrender.com/api/v1/health/ready` → `{"status":"ok","database":"up"}`
   - `https://restauradores-api.onrender.com/api/v1/eventos` → contenido real
   - El portal abre, navega entre secciones y el Museo Virtual carga los objetos.
6. Si corregiste alguna URL después de crear los servicios: actualiza `CORS_ORIGINS` (API) y `VITE_API_BASE_URL` (portal) y redespliega los dos.

Cada push a `main` vuelve a desplegar. En cada arranque, la API aplica las migraciones pendientes y sincroniza el contenido de `backend/seeds/datos/` (idempotente).

## ⚠️ Limitaciones del plan gratuito

- La API **se duerme tras 15 minutos sin visitas**: la primera petición después tarda cerca de un minuto. Antes de una presentación, abre el portal unos minutos antes.
- La base de datos gratuita **vence** pasado un tiempo (revisa el plan vigente en Render). Para la entrega final, considera un plan pago o respalda los visitantes registrados.
- Antes de publicar: resuelve los pendientes de [`README.md`](README.md) (autorización de imagen de menores y firmas en documentos escaneados).

## 💡 Ejemplos de uso

```bash
curl https://restauradores-api.onrender.com/api/v1/health/ready
curl "https://restauradores-api.onrender.com/api/v1/actividades?tipo=salida_pedagogica"
```
