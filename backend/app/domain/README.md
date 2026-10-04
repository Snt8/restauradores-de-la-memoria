# 💎 app/domain/

## 📖 Introducción
Capa más interna de la arquitectura: entidades, reglas y **puertos** (interfaces) del sistema.

## 🗂️ Archivos

| Archivo | Qué hace |
|---|---|
| `health.py` | `ComponentStatus`, `ReadinessReport` y el puerto `DatabaseProbe` |

## 🎯 Problema que resuelve
Mantiene las reglas del negocio independientes de frameworks, bases de datos y HTTP, para que se puedan probar y evolucionar sin efectos colaterales.

## 🔗 Dependencias
**Ninguna externa.** Solo la librería estándar de Python. Esta regla no se rompe.

## 🛠️ Cómo lo soluciona
- **`ComponentStatus`** (`StrEnum`): `up` o `down`.
- **`ReadinessReport`** (dataclass inmutable): estado de cada dependencia, con la propiedad `is_ready`.
- **`DatabaseProbe`** (`Protocol`): contrato `async ping() -> bool`. El dominio define *qué* necesita y la infraestructura decide *cómo*.

Aquí vivirán las entidades del portal (`ObjetoMuseo`, `Evento`, `Evidencia`...) y los protocolos de sus repositorios.

## 💡 Ejemplos de uso

```python
from app.domain.health import ComponentStatus, ReadinessReport

report = ReadinessReport(database=ComponentStatus.UP)
report.is_ready  # True
```
