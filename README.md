# 🏛️ Restauradores de la Memoria: Portal Web

> Portal web y **Museo Virtual de la Memoria** del proyecto *Restauradores de la Memoria*, Colegio Tom Adams IED.

---

## 📖 Introducción

Este repositorio contiene el portal que divulga, organiza y presenta la memoria institucional del proyecto: actividades, salidas pedagógicas, fechas conmemorativas, eventos, reconocimientos, alianzas y el Museo Escolar de la Memoria con un recorrido virtual en 3D.

## 🗂️ Estructura del repositorio

| Ruta | Qué contiene |
|---|---|
| 📁 [`frontend/`](frontend/README.md) | SPA en React + Tailwind + Vite (portal y museo A-Frame) |
| 📁 [`backend/`](backend/README.md) | API REST en FastAPI con Clean Architecture, SQLAlchemy y Alembic, y el contenido inicial (`seeds/`) |
| 📁 [`assets-pipeline/`](assets-pipeline/README.md) | Extrae y optimiza las imágenes de las fuentes y genera modelos 3D provisionales |
| 📁 [`docs/`](docs/README.md) | Cumplimiento de la primera entrega, pendientes y guion de la demo |
| 📁 [`docker/`](docker/README.md) | Scripts de inicialización de PostgreSQL |
| 📄 `docker-compose.yml` | Servicio de PostgreSQL 18 para desarrollo |
| 📁 `.github/workflows/` | CI: lint, formato, tests y build en cada push o PR |
| 📁 `.claude/` | Instrucciones, reglas y stack del proyecto |

## 🧱 Stack

| Capa | Tecnologías |
|---|---|
| 🎨 Frontend | React 19, Tailwind CSS 4, Vite, React Router, TanStack Query |
| 🧪 Tests frontend | Vitest, Testing Library |
| ⚙️ Backend | FastAPI, SQLAlchemy 2 (async), Alembic, Pydantic Settings |
| 🧪 Tests backend | pytest, pytest-asyncio |
| 🗄️ Base de datos | PostgreSQL 18 |
| 🕶️ Museo 3D | A-Frame (carga diferida) |
| 🖼️ Medios | Pillow (pipeline de imágenes WebP) |

---

## 🚀 Puesta en marcha

### ✅ Requisitos
- Node.js 24 o superior
- Python 3.12 o superior
- Docker Desktop

### 1️⃣ Base de datos

```bash
docker compose up -d db
```

PostgreSQL queda en `localhost:5433` con las bases `restauradores` (desarrollo) y `restauradores_test` (pruebas).

### 2️⃣ Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows  (Linux/macOS: source .venv/bin/activate)
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
python -m seeds.load          # contenido inicial real (idempotente)
uvicorn app.main:app --reload
```

API en http://localhost:8000. Documentación interactiva en http://localhost:8000/docs.

### 3️⃣ Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Portal en http://localhost:5173. Las peticiones a `/api` se reenvían al backend.

### 4️⃣ Medios (solo si cambian las fuentes o el catálogo)

Las imágenes ya publicadas están en `frontend/public/media/`. Para regenerarlas hace falta el material del docente en `.claude/third-party/` (no se versiona):

```bash
cd assets-pipeline
python -m venv .venv
.venv/Scripts/activate
pip install -e ".[dev]"
python -m media_pipeline.extraer
```

---

## 🧪 Calidad: nada entra al repositorio sin pruebas

| Comando | Dónde | Qué hace |
|---|---|---|
| `npm run lint` | frontend | oxlint (sin warnings permitidos) |
| `npm run format:check` | frontend | Prettier |
| `npm test` | frontend | Tests unitarios y de integración (Vitest) |
| `ruff check . && ruff format --check .` | backend | Lint y formato |
| `pytest -m unit` | backend | Pruebas aisladas, sin base de datos |
| `pytest` | backend | Todo, incluida la integración contra PostgreSQL |
| `ruff check . && pytest` | assets-pipeline | Lint y pruebas del pipeline de medios |

## 🌿 Flujo de Git

- Ramas: `feat/<tema>`, `fix/<tema>`, `docs/<tema>`, `chore/<tema>`
- Commits con [Conventional Commits](https://www.conventionalcommits.org/es/): `feat(museo): agrega panel de información`
- Todo cambio pasa por un Pull Request con la CI en verde.

## 📋 Primera entrega

El detalle de qué se cumple, dónde y qué falta está en [`docs/README.md`](docs/README.md). Lo principal que depende del equipo: **reemplazar los dos modelos 3D provisionales por objetos reales escaneados** y validar los textos institucionales con el docente.

## 🏗️ Principios de arquitectura

- **Clean Architecture** en el backend: `domain` ← `application` ← `infrastructure` / `presentation`.
- **Organización por capas** en el frontend: `pages → features → entities → shared`; las páginas componen y solo `shared/api` habla HTTP.
- **Integridad en la base de datos:** `CHECK`, `UNIQUE` y llaves foráneas reales protegen los datos aunque se escriba sin pasar por la API.
- **No inventar información:** las fechas guardan solo la precisión que traen las fuentes; lo desconocido se muestra como «por confirmar».
- **SOLID** como criterio de diseño, código reutilizable y sin lógica duplicada.
