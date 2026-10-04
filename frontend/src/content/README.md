# 📝 src/content/

## 📖 Introducción

Textos institucionales fijos del portal: nombre, lema, datos de contacto, la presentación del proyecto y del museo.

## 🗂️ Archivos

| Archivo    | Qué contiene                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `sitio.js` | `PROYECTO` (identidad y contacto), `QUE_ES` (qué es, propósito, importancia, actividades, participantes) y `MUSEO` (presentación y créditos) |

## 🎯 Problema que resuelve

Que el equipo de contenidos pueda revisar y corregir los textos en un solo archivo, sin buscar entre componentes.

## 🔗 Dependencias

Ninguna.

## 🛠️ Cómo lo soluciona

- Solo vive aquí lo que **no cambia** con el tiempo. Eventos, salidas, reconocimientos y demás llegan de la API.
- Cada texto se redactó a partir de las fuentes del proyecto (presentación del docente, archivo de evidencias 2025, comunicación del CNMH y Ley 1448 de 2011). **Antes de publicar, el docente debe validarlos.**

## 💡 Ejemplos de uso

```jsx
import { PROYECTO } from '@/content/sitio.js'

export function Correo() {
  return <a href={`mailto:${PROYECTO.correo}`}>{PROYECTO.correo}</a>
}
```
