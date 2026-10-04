# 🌐 app/presentation/

## 📖 Introducción
Capa de entrada HTTP: traduce peticiones a casos de uso y resultados de dominio a JSON.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `api/dependencies.py` | *Composition root*: conecta casos de uso con sus adaptadores |
| `api/v1/router.py` | Router raíz de la v1; registra los routers de cada módulo |
| `api/v1/routers/health.py` | Endpoints `/health` y `/health/ready` |
| `api/v1/schemas/health.py` | `LivenessResponse` y `ReadinessResponse` (Pydantic) |

## 🎯 Problema que resuelve
Mantiene FastAPI fuera del dominio y de los casos de uso. Si mañana cambia el protocolo de entrada, solo cambia esta capa.

## 🔗 Dependencias
`fastapi`, `pydantic`, `app.application`, `app.infrastructure` (solo en `dependencies.py`)

## 🛠️ Cómo lo soluciona
- **Versionado** bajo `/api/v1`: futuras versiones conviven sin romper clientes.
- **`dependencies.py`** es el único lugar donde la presentación conoce la infraestructura. Construye los casos de uso con sus adaptadores. Los alias `SettingsDep`, `DatabaseDep` y `DbSessionDep` evitan repetir `Depends(...)`.
- **Schemas separados del dominio:** `ReadinessResponse.from_report()` traduce el reporte de dominio a la respuesta pública.
- **Códigos HTTP correctos:** `/health/ready` responde `503` cuando la base de datos no está disponible.

## 💡 Ejemplos de uso

Agregar un módulo nuevo:

```python
# api/v1/routers/eventos.py
router = APIRouter(prefix="/eventos", tags=["eventos"])


@router.get("", response_model=list[EventoResponse])
async def listar(use_case: Annotated[ListarEventos, Depends(get_listar_eventos)]):
    return await use_case.execute()


# api/v1/router.py
api_router.include_router(eventos.router)
```

```bash
curl http://localhost:8000/api/v1/health/ready
# {"status":"ok","database":"up"}
```
