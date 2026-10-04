# 🎯 app/application/

## 📖 Introducción
Casos de uso del sistema: cada clase resuelve **una** acción concreta orquestando el dominio.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `health.py` | Caso de uso `CheckReadiness` |

## 🎯 Problema que resuelve
Separa *qué hace* el sistema (casos de uso) de *cómo* se expone (HTTP) y de *dónde* se guarda (base de datos).

## 🔗 Dependencias
Solo `app.domain`. Nunca importa FastAPI ni SQLAlchemy.

## 🛠️ Cómo lo soluciona
**`CheckReadiness(database_probe, timeout_seconds)`**
- Recibe el puerto `DatabaseProbe` por constructor (inyección de dependencias).
- `execute()` comprueba la base de datos dentro de `asyncio.timeout`. Si tarda más del límite la reporta como `down`, así una base de datos colgada no bloquea el endpoint.
- Devuelve un `ReadinessReport` de dominio.

## 💡 Ejemplos de uso

```python
use_case = CheckReadiness(SqlAlchemyDatabaseProbe(engine), timeout_seconds=2)
report = await use_case.execute()
```

En pruebas, con un doble:

```python
class FakeProbe:
    async def ping(self) -> bool:
        return False


report = await CheckReadiness(FakeProbe(), timeout_seconds=1).execute()
assert not report.is_ready
```
