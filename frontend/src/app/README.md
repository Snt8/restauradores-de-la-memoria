# 🚀 src/app/

## 📖 Introducción

Núcleo de arranque de la aplicación: todo lo global que envuelve a las páginas.

## 🗂️ Archivos

| Archivo                      | Qué hace                                                           |
| ---------------------------- | ------------------------------------------------------------------ |
| `navegacion.js`              | Mapa del sitio: `RUTAS`, `PAGINAS`, `MENU` y `ACCESOS_PRINCIPALES` |
| `providers/AppProviders.jsx` | Agrupa los providers globales (TanStack Query)                     |
| `providers/queryClient.js`   | `createQueryClient()` con la política de caché                     |
| `router/routes.jsx`          | Rutas declarativas, con página de error que conserva el layout     |
| `router/AppRouter.jsx`       | Crea el router del navegador a partir de `routes`                  |
| `layout/RootLayout.jsx`      | Skip link, encabezado, `<main>`, pie y restauración del scroll     |
| `layout/Encabezado.jsx`      | Marca, menú principal, acceso al Museo Virtual y menú móvil        |
| `layout/MenuDesplegable.jsx` | Grupo del menú (patrón _disclosure_)                               |
| `layout/PieDePagina.jsx`     | Identidad, contacto y mapa del sitio                               |
| `*.test.js(x)`               | Navegación, menú y mapa del sitio                                  |

## 🎯 Problema que resuelve

Centraliza la configuración transversal para que las páginas no repitan providers, layout ni rutas.

## 🔗 Dependencias

`react-router`, `@tanstack/react-query`, `@/pages/*`, `@/shared/*`, `@/content/*`

## 🛠️ Cómo lo soluciona

- **Un mapa del sitio:** `navegacion.js` define rutas, nombres y descripciones una sola vez. Lo usan el menú, el pie, los accesos de inicio y los títulos de cada página.
- **Rutas como datos:** el mismo arreglo `routes` alimenta `createBrowserRouter` (app real) y `createMemoryRouter` (pruebas).
- **Menú accesible:** botones con `aria-expanded`/`aria-controls`, cierre con Escape o clic fuera, y foco devuelto al botón. Los menús guardan la ruta en la que se abrieron: al navegar se cierran solos, sin efectos extra.
- **Caché:** `staleTime` de 5 minutos; navegar entre secciones no repite peticiones.
- **Errores contenidos:** una ruta sin camino con `errorElement` hace que un fallo en una página muestre el aviso dentro del layout, sin perder el menú.

## 💡 Ejemplos de uso

Agregar una sección:

```js
// navegacion.js
RUTAS.publicaciones = '/publicaciones'
PAGINAS.publicaciones = pagina(RUTAS.publicaciones, 'Publicaciones', 'Artículos del proyecto.')
```

```jsx
// router/routes.jsx
{ path: RUTAS.publicaciones, element: <PublicacionesPage /> },
```
