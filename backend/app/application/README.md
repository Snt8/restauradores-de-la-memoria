# 🎯 app/application/

## 📖 Introducción

Casos de uso del sistema: cada clase resuelve **una** acción concreta orquestando el dominio.

## 🗂️ Archivos

| Archivo         | Qué hace                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| `contenido.py`  | `ListarContenido[T, F]` y `ObtenerContenido[T]`: genéricos para todo el contenido |
| `visitantes.py` | `RegistrarVisitante`: guarda un contacto o una firma del libro de visitas      |
| `health.py`     | `CheckReadiness`: comprueba si la API puede atender peticiones                 |

## 🎯 Problema que resuelve

Separa _qué hace_ el sistema (casos de uso) de _cómo_ se expone (HTTP) y de _dónde_ se guarda (base de datos).

## 🔗 Dependencias

Solo `app.domain`. Nunca importa FastAPI ni SQLAlchemy.

## 🛠️ Cómo lo soluciona

- **Casos de uso genéricos, sin lógica repetida:** las siete colecciones del portal (exposiciones, objetos, eventos, actividades, reconocimientos, aliados y galería) se consultan igual. En vez de catorce clases casi idénticas hay dos genéricas que reciben el repositorio por constructor (DIP).
- **`ObtenerContenido`** traduce "no existe" en `EntidadNoEncontrada`; la presentación lo convierte en un `404`.
- **`CheckReadiness`** comprueba la base de datos dentro de `asyncio.timeout`: una base colgada no bloquea el endpoint.

## 💡 Ejemplos de uso

```python
pagina = await ListarContenido(repositorio_eventos).ejecutar(
    FiltrosEventos(tipo=TipoEvento.MEDIOS), Paginacion(limite=20)
)
objeto = await ObtenerContenido(repositorio_objetos, "objetos del museo").ejecutar("pieza-1")
```

En pruebas, con un doble en memoria:

```python
class RepositorioEnMemoria:
    async def obtener(self, slug):
        return None


await ObtenerContenido(RepositorioEnMemoria(), "eventos").ejecutar("x")  # EntidadNoEncontrada
```
