# 🧩 src/features/paneles/

## 📖 Introducción

Tarjetas de la columna derecha que se repiten en varias páginas del portal.

## 🗂️ Archivos

| Archivo                | Qué hace                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `PanelesDelPortal.jsx` | `AcercaDelProyecto` (cita y datos del colegio), `AccesoAlMuseoVirtual` e `InvitacionAlForo` |

## 🎯 Problema que resuelve

Que cada sección le ofrezca al visitante un siguiente paso (conocer el proyecto, recorrer la sala 3D, conversar en el foro) sin repetir el marcado en cada página.

## 🔗 Dependencias

`react-router`, `src/app/navegacion.js`, `src/content/sitio.js` y `src/shared/ui/*` (`TarjetaPanel`, `EnlaceBoton`, `Icono`).

## 🛠️ Cómo lo soluciona

- Cada tarjeta se construye sobre `TarjetaPanel`, así todas comparten aspecto y accesibilidad (sección con `<h2>` como nombre).
- `InvitacionAlForo` recibe la categoría del foro que corresponde a la sección: desde Salidas abre el formulario ya en «Salidas pedagógicas».

## 💡 Ejemplos de uso

```jsx
<PlantillaDePagina
  portada={…}
  panel={<InvitacionAlForo titulo="¿Fuiste a alguna salida?" categoria="salidas" />}
>
  …
</PlantillaDePagina>
```
