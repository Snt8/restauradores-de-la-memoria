# 💎 app/domain/

## 📖 Introducción

Capa más interna de la arquitectura: entidades, reglas y **puertos** (interfaces) del sistema. Aquí se define qué es una exposición, un objeto del museo o una evidencia, sin saber nada de HTTP ni de bases de datos.

## 🗂️ Archivos

| Archivo              | Qué contiene                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `shared.py`          | `FechaParcial`, `Paginacion`, `Pagina[T]`, `SinFiltros` y los errores base (`ErrorDeDominio`, `EntidadNoEncontrada`) |
| `museo.py`           | `Exposicion`, `ObjetoMuseo`, `UbicacionEnSala`, `ReferenciaExposicion`                                          |
| `evidencias.py`      | `Evidencia`, `TipoEvidencia`, `SeccionEvidencia`, `ElementoGaleria`, `FiltrosGaleria`                           |
| `eventos.py`         | `Evento`, `TipoEvento` (visita, evento, medios), `FiltrosEventos`                                               |
| `actividades.py`     | `Actividad`, `TipoActividad` (salida pedagógica, fecha conmemorativa, formación), `FiltrosActividades`          |
| `reconocimientos.py` | `Reconocimiento`                                                                                                |
| `aliados.py`         | `Aliado`                                                                                                        |
| `visitantes.py`      | `NuevoVisitante` (con sus reglas), `VisitanteRegistrado`, `OrigenVisitante` y el puerto `RepositorioVisitantes` |
| `repositorios.py`    | Puertos genéricos de lectura: `RepositorioListado[T, F]` y `RepositorioLectura[T, F]`                           |
| `health.py`          | `ComponentStatus`, `ReadinessReport` y el puerto `DatabaseProbe`                                                |

## 🎯 Problema que resuelve

Mantiene las reglas del negocio independientes de frameworks, bases de datos y HTTP, para probarlas y evolucionarlas sin efectos colaterales.

## 🔗 Dependencias

**Ninguna externa.** Solo la librería estándar de Python. Esta regla no se rompe.

## 🛠️ Cómo lo soluciona

- **Entidades inmutables** (`@dataclass(frozen=True, slots=True)`): lo que sale de un repositorio no se modifica por accidente.
- **`FechaParcial`**: las fuentes del proyecto rara vez traen la fecha completa («octubre de 2023», «9 de abril»). En vez de inventar días, la fecha guarda solo la precisión real y valida las combinaciones: año; año y mes; fecha completa; día y mes sin año (conmemoración recurrente); o vacía (por confirmar).
- **`SeccionEvidencia`**: una evidencia pertenece a la sección del contenido que respalda (museo, salidas, conmemoraciones, eventos…). La galería filtra por ella.
- **Reglas de visitantes**: `NuevoVisitante` no se puede construir sin la autorización de tratamiento de datos (Ley 1581 de 2012), y el formulario de contacto exige mensaje (el libro de visitas no).
- **Puertos genéricos** (ISP): `RepositorioListado` solo lista; `RepositorioLectura` además obtiene por slug. La galería implementa el primero y las colecciones el segundo.

## 💡 Ejemplos de uso

```python
from app.domain.shared import FechaParcial

FechaParcial(anio=2023, mes=10)  # octubre de 2023
FechaParcial(mes=4, dia=9).es_recurrente  # True: 9 de abril de cada año
FechaParcial(mes=4)  # FechaInvalida: un mes sin año ni día no es una fecha
```

```python
from app.domain.visitantes import NuevoVisitante, OrigenVisitante

NuevoVisitante(
    nombre="Ana",
    correo="ana@example.com",
    origen=OrigenVisitante.CONTACTO,
    consentimiento_datos=False,
)  # ConsentimientoRequerido
```
