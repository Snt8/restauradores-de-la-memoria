# 📄 src/pages/

## 📖 Introducción

Una página por cada sección del portal (Inicio, Museo, Salidas, etc.).

## 🗂️ Archivos

| Archivo            | Qué hace                                       |
| ------------------ | ---------------------------------------------- |
| `HomePage.jsx`     | Inicio (contenido provisional hasta la Fase 2) |
| `NotFoundPage.jsx` | Página 404 con enlace de regreso al inicio     |

## 🎯 Problema que resuelve

Da un punto de entrada claro por URL y separa la **composición** de una pantalla de la **lógica** de cada dominio.

## 🔗 Dependencias

`react-router` y, a partir de la Fase 2, componentes y hooks de `src/features/*` y `src/shared/ui`.

## 🛠️ Cómo lo soluciona

Las páginas son delgadas: arman la pantalla con componentes de features y no hacen peticiones ni contienen reglas de negocio. Cada página usa un único `<h1>` enlazado a su `<section>` con `aria-labelledby`.

## 💡 Ejemplos de uso

```jsx
export function OutingsPage() {
  return (
    <section aria-labelledby="titulo-salidas">
      <h1 id="titulo-salidas">Salidas Pedagógicas</h1>
      <OutingsTimeline /> {/* desde features/outings */}
    </section>
  )
}
```
