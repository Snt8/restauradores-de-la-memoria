# 🚀 src/app/

## 📖 Introducción

Núcleo de arranque de la aplicación: todo lo global que envuelve a las páginas.

## 🗂️ Archivos

| Archivo                        | Qué hace                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `navegacion.js`                | Mapa del sitio: `RUTAS`, `PAGINAS` (con ícono y nombre corto), `MENU` en grupos, `PAGINAS_DEL_MENU` y `ACCESOS_PRINCIPALES` |
| `paginaActiva.js`              | `paginaActiva(ruta)`: la página del menú que corresponde a una URL (prefijo más largo)                                      |
| `usePrecarga.js`               | Precarga los datos de una sección cuando se apunta o enfoca su enlace                                                       |
| `providers/AppProviders.jsx`   | Agrupa los providers globales (TanStack Query)                                                                              |
| `providers/queryClient.js`     | `createQueryClient()` con la política de caché                                                                              |
| `router/routes.jsx`            | Rutas declarativas, con página de error que conserva el layout                                                              |
| `router/AppRouter.jsx`         | Crea el router del navegador a partir de `routes`                                                                           |
| `layout/RootLayout.jsx`        | Estructura estilo Reddit: barra superior, navegación lateral fija (`lg`), `<main>` y pie                                    |
| `layout/Encabezado.jsx`        | Barra superior: botón de menú (móvil), marca, «Publicar en el foro» y Museo Virtual                                         |
| `layout/NavegacionLateral.jsx` | Menú en grupos con íconos y página actual; el mismo se usa en el menú móvil                                                 |
| `layout/PieDePagina.jsx`       | Identidad, contacto y mapa del sitio en línea                                                                               |
| `*.test.js(x)`                 | Navegación, menú y mapa del sitio                                                                                           |

## 🎯 Problema que resuelve

Centraliza la configuración transversal para que las páginas no repitan providers, layout ni rutas.

## 🔗 Dependencias

`react-router`, `@tanstack/react-query`, `@/pages/*`, `@/shared/*`, `@/content/*`

## 🛠️ Cómo lo soluciona

- **Un mapa del sitio:** `navegacion.js` define rutas, nombres y descripciones una sola vez. Lo usan el menú, el pie, los accesos de inicio y los títulos de cada página.
- **Rutas como datos:** el mismo arreglo `routes` alimenta `createBrowserRouter` (app real) y `createMemoryRouter` (pruebas).
- **Navegación como Reddit:** desde `lg` el menú es una columna fija a la izquierda, agrupada (Museo, Actividades, El proyecto) y con íconos; la página actual se marca con `aria-current` aunque se esté en una subpágina (una publicación marca «Foro»). En pantallas menores la misma lista se abre desde el botón de menú, que se cierra con Escape o al navegar.
- **Precarga:** al apuntar o enfocar un enlace del menú, `usePrecarga` pide los datos de esa sección con las mismas claves de caché que usa la página, así se abre sin esqueletos de carga.
- **Caché:** `staleTime` de 5 minutos; navegar entre secciones no repite peticiones.
- **Errores contenidos:** una ruta sin camino con `errorElement` hace que un fallo en una página muestre el aviso dentro del layout, sin perder el menú.

## 💡 Ejemplos de uso

Agregar una sección:

```js
// navegacion.js
RUTAS.publicaciones = '/publicaciones'
PAGINAS.publicaciones = pagina({
  ruta: RUTAS.publicaciones,
  etiqueta: 'Publicaciones',
  descripcion: 'Artículos del proyecto.',
  icono: 'documento',
})
// y agregarla a un grupo de MENU
```

```jsx
// router/routes.jsx
{ path: RUTAS.publicaciones, element: <PublicacionesPage /> },
```
