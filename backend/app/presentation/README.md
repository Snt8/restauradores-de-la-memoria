# 🌐 app/presentation/

## 📖 Introducción

Capa de entrada HTTP: traduce peticiones a casos de uso y resultados de dominio a JSON.

## 🗂️ Archivos

| Archivo                         | Qué hace                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `api/dependencies.py`           | _Composition root_: conecta casos de uso y repositorios; paginación como dependencia |
| `api/errores.py`                | Traduce errores de dominio a HTTP (`404`, `422`)                                    |
| `api/v1/router.py`              | Router raíz de la v1; registra los routers de cada módulo                           |
| `api/v1/routers/contenido.py`   | `crear_router_de_contenido()`: fábrica de routers de lectura                        |
| `api/v1/routers/colecciones.py` | Las siete colecciones construidas con la fábrica, con sus filtros                   |
| `api/v1/routers/visitantes.py`  | `POST /visitantes`                                                                  |
| `api/v1/routers/health.py`      | `/health` y `/health/ready`                                                         |
| `api/v1/schemas/comunes.py`     | `EsquemaDeDominio`, `FechaParcialSchema`, `EvidenciaSchema`, `PaginaSchema[T]`      |
| `api/v1/schemas/contenido.py`   | Respuesta de cada colección                                                         |
| `api/v1/schemas/visitantes.py`  | `VisitanteEntrada` (validación) y `VisitanteRegistradoSchema`                       |

## 🎯 Problema que resuelve

Mantiene FastAPI fuera del dominio y de los casos de uso. Si mañana cambia el protocolo de entrada, solo cambia esta capa.

## 🔗 Dependencias

`fastapi`, `pydantic` (con `email-validator`), `app.application`, `app.infrastructure` (solo en `dependencies.py` y en la configuración de colecciones)

## 🛠️ Cómo lo soluciona

- **Una fábrica para todas las colecciones:** `crear_router_de_contenido()` genera `GET /{ruta}` (paginado y filtrable) y `GET /{ruta}/{slug}`. Cada colección solo declara su esquema, su repositorio y su función de filtros.
- **Esquemas que leen el dominio:** `EsquemaDeDominio` usa `from_attributes`, así una entidad se convierte en respuesta sin código de mapeo repetido.
- **Privacidad:** `POST /visitantes` responde solo `id` y `creado_en`; los datos personales no vuelven al cliente.
- **Errores coherentes:** `EntidadNoEncontrada` → `404`; cualquier otra regla de negocio (`ConsentimientoRequerido`, `MensajeRequerido`) → `422` con un `detail` legible.

## 📡 Endpoints (`/api/v1`)

| Método | Ruta                   | Filtros                                 | Descripción                                   |
| ------ | ---------------------- | --------------------------------------- | --------------------------------------------- |
| GET    | `/exposiciones[/slug]` | —                                       | Ediciones y exposiciones del museo            |
| GET    | `/objetos[/slug]`      | —                                       | Objetos del museo con ubicación en la sala 3D |
| GET    | `/eventos[/slug]`      | `tipo` (visita, evento, medios), `anio` | Visitas, eventos y medios                     |
| GET    | `/actividades[/slug]`  | `tipo`, `anio`                          | Salidas, fechas conmemorativas y formación    |
| GET    | `/reconocimientos[/slug]` | —                                    | Reconocimientos                               |
| GET    | `/aliados[/slug]`      | —                                       | Alianzas institucionales                      |
| GET    | `/galeria`             | `tipo` (foto, video, audio…), `seccion` | Todas las evidencias con su sección           |
| POST   | `/visitantes`          | —                                       | Contacto o firma del libro de visitas         |
| GET    | `/health[/ready]`      | —                                       | Estado del servicio                           |

Todas las listas aceptan `limite` (1 a 100, por defecto 50) y `desplazamiento`, y responden `{elementos, total, limite, desplazamiento}`.

## 💡 Ejemplos de uso

```bash
curl "http://localhost:8000/api/v1/actividades?tipo=salida_pedagogica"
curl "http://localhost:8000/api/v1/galeria?seccion=museo&tipo=foto&limite=24"
curl -X POST http://localhost:8000/api/v1/visitantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","correo":"ana@example.com","mensaje":"Hola","consentimiento_datos":true}'
```

Agregar una colección:

```python
crear_router_de_contenido(
    ruta="publicaciones",
    etiqueta="publicaciones",
    entidad="publicaciones",
    esquema=PublicacionSchema,
    repositorio=proveedor_de_lectura(configuraciones.PUBLICACIONES),
)
```
