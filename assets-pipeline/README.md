# 🖼️ assets-pipeline/

## 📖 Introducción

Herramientas para preparar los medios del portal:

1. **Imágenes:** extrae las fotografías de los documentos fuente (`.pptx` y `.docx` del docente) y las publica en WebP, en dos tamaños, dentro de `frontend/public/media/`.
2. **Modelos 3D provisionales:** genera dos piezas neutras en `.glb` para desarrollar el Museo Virtual mientras el equipo digitaliza los objetos reales.

## 🗂️ Archivos

| Archivo                       | Qué hace                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `catalogo.json`               | Qué imagen de qué fuente se publica, con qué nombre, recorte y rotación           |
| `media_pipeline/catalogo.py`  | Carga y valida el catálogo (`CatalogoInvalido` si algo no cuadra)                 |
| `media_pipeline/imagenes.py`  | Funciones puras: `preparar`, `redimensionar`, `codificar_webp`, `nombre_de_salida` |
| `media_pipeline/extraer.py`   | CLI que procesa el catálogo completo                                              |
| `media_pipeline/modelos.py`   | Geometría (`caja`, `torno`), escritor glTF binario y CLI de modelos provisionales |
| `tests/`                      | Pruebas unitarias e de integración (`tests/glb.py` lee los `.glb` generados)      |

## 🎯 Problema que resuelve

Las fuentes traen ~200 imágenes dentro de documentos de Office (54 MB), en formatos y tamaños dispares. Publicarlas tal cual haría el portal lento y el repositorio pesado. Además, el Museo Virtual necesita modelos 3D para desarrollarse antes de que existan los escaneos reales.

## 🔗 Dependencias

`pillow` (con soporte WebP). Desarrollo: `pytest`, `ruff`.

## 🛠️ Cómo lo soluciona

- **Curaduría explícita:** solo se publica lo que está en `catalogo.json` (hoy 120 imágenes, unos 8 MB en total). Cada destino tiene un nombre legible (`museo/2025-altar-sanacion`).
- **Sin descomprimir:** los `.docx` y `.pptx` son ZIP; se leen directamente con `zipfile`.
- **Dos tamaños por imagen:** `-sm` (480 px) para tarjetas y `-lg` (1280 px) para el visor. Nunca se amplía una imagen pequeña.
- **Ajustes por imagen:** `recorte` (`[izq, arriba, der, abajo]`) y `rotacion` (grados en sentido horario) para corregir fotos giradas.
- **Transparencia conservada:** las fotos recortadas en círculo de la presentación mantienen su canal alfa.
- **glTF 2.0 escrito a mano:** el escritor arma el JSON y el buffer binario con vistas alineadas a 4 bytes, `min`/`max` en `POSITION` y un material por malla. Sin dependencias pesadas.

## 💡 Ejemplos de uso

```bash
cd assets-pipeline
python -m venv .venv
.venv/Scripts/activate              # Linux/macOS: source .venv/bin/activate
pip install -e ".[dev]"

python -m media_pipeline.extraer    # lee ../.claude/third-party y escribe ../frontend/public/media
python -m media_pipeline.modelos    # escribe ../frontend/public/models/*.glb
pytest                              # pruebas
```

Agregar una imagen al portal:

```json
{ "fuente": "evidencias", "miembro": "word/media/image27.jpeg", "destino": "eventos/feria-2026" }
```

y referenciarla desde los seeds del backend como `"url": "media/eventos/feria-2026"`.

### 🧊 Modelos 3D reales (fotogrametría)

1. Escanear el objeto con Luma AI, Polycam o KIRI Engine y exportar en `.glb`.
2. Optimizarlo (meta: menos de 5 MB):
   ```bash
   npx @gltf-transform/cli optimize objeto.glb objeto-opt.glb --compress false --texture-compress webp --texture-size 2048
   ```
3. Copiarlo a `frontend/public/models/` y actualizar su entrada en `backend/seeds/datos/objetos_museo.json`.
