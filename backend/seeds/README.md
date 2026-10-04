# 🌱 seeds/

## 📖 Introducción

Contenido inicial del portal y el cargador que lo lleva a la base de datos. Todo lo que hay en `datos/` sale de las fuentes del proyecto: la presentación del docente, el archivo de evidencias 2025 y, para las fechas conmemorativas, normas públicas verificables (Ley 1448 de 2011, Decreto 1480 de 2014).

## 🗂️ Archivos

| Archivo                       | Qué hace                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `esquema.py`                  | Modelos Pydantic de cada archivo JSON: valida antes de tocar la base de datos |
| `cargador.py`                 | `leer_directorio()` y `cargar()`: sincronización idempotente por slug         |
| `load.py`                     | CLI: `python -m seeds.load`                                                   |
| `datos/exposiciones.json`     | Ediciones del Museo Escolar (2021 a 2026) y exposiciones externas             |
| `datos/objetos_museo.json`    | Objetos del museo con su modelo 3D y su ubicación en la sala virtual          |
| `datos/eventos.json`          | Visitas, eventos y apariciones en medios                                      |
| `datos/actividades.json`      | Salidas pedagógicas, fechas conmemorativas y formación docente                |
| `datos/reconocimientos.json`  | Reconocimientos                                                               |
| `datos/aliados.json`          | Alianzas institucionales                                                      |
| `datos/archivo.json`          | Evidencias sueltas, sin un contenido asociado                                 |

## 🎯 Problema que resuelve

Que el portal tenga contenido real desde el primer día, que cualquiera del equipo pueda recrearlo con un comando y que corregir un dato sea editar un JSON, no escribir SQL.

## 🔗 Dependencias

`pydantic`, `sqlalchemy`, los modelos ORM de `app.infrastructure` y el dominio (`FechaParcial` valida las fechas).

## 🛠️ Cómo lo soluciona

- **Idempotente:** cada elemento se crea o actualiza por su `slug`, y sus evidencias se reemplazan. Ejecutarlo dos veces deja la base igual.
- **Valida todo primero:** si un JSON tiene un error (fecha imposible, slug repetido, exposición inexistente), no se escribe nada.
- **Sin repetición:** `creditos_por_defecto` se aplica a las evidencias que no declaran créditos propios.
- **Imágenes:** las URL que empiezan por `media/` apuntan a `frontend/public/media/<ruta>-sm.webp` y `-lg.webp`, que genera `assets-pipeline`. Una prueba verifica que todas existan.
- **Lo que no se sabe no se inventa:** si la fuente no da la fecha, el campo queda vacío y el portal muestra «Fecha por confirmar».

## 💡 Ejemplos de uso

```bash
alembic upgrade head
python -m seeds.load                                  # usa DATABASE_URL del .env
python -m seeds.load --database-url postgresql+asyncpg://...
```

Agregar un evento:

```json
{
  "slug": "conversatorio-2026",
  "nombre": "Conversatorio con víctimas",
  "tipo": "evento",
  "fecha": { "anio": 2026, "mes": 5 },
  "evidencias": [{ "tipo": "foto", "url": "media/eventos/conversatorio-2026", "titulo": "Asistentes" }]
}
```

Reemplazar un objeto provisional del museo por uno real: copiar el `.glb` a `frontend/public/models/`, la foto al catálogo de `assets-pipeline` y editar su entrada en `objetos_museo.json` (nombre, descripción, importancia, créditos, `foto_url`, `modelo_3d_url`). La ubicación en la sala se ajusta con `ubicacion`.
