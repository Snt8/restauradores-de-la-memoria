# 🚀 src/app/

## 📖 Introducción

Núcleo de arranque de la aplicación: todo lo global que envuelve a las páginas.

## 🗂️ Archivos

| Archivo                      | Qué hace                                                      |
| ---------------------------- | ------------------------------------------------------------- |
| `providers/AppProviders.jsx` | Agrupa los providers globales (por ahora, TanStack Query)     |
| `providers/queryClient.js`   | Fábrica `createQueryClient()` con la política de caché        |
| `router/routes.jsx`          | Configuración declarativa de rutas (datos, no componentes)    |
| `router/AppRouter.jsx`       | Crea el router del navegador a partir de `routes`             |
| `router/routes.test.jsx`     | Pruebas de integración de navegación y layout                 |
| `layout/RootLayout.jsx`      | Estructura común: skip link, `<header>`, `<main>`, `<footer>` |

## 🎯 Problema que resuelve

Centraliza la configuración transversal para que las páginas no repitan providers, layout ni lógica de navegación.

## 🔗 Dependencias

`react-router`, `@tanstack/react-query`, `@/pages/*`

## 🛠️ Cómo lo soluciona

- **Rutas como datos:** el mismo arreglo `routes` alimenta `createBrowserRouter` (app real) y `createMemoryRouter` (pruebas), sin duplicar configuración.
- **Inyección del QueryClient:** `AppProviders` acepta un `queryClient` opcional, así las pruebas usan una caché aislada.
- **Caché:** `staleTime` de 5 minutos, porque el contenido cambia poco. Navegar entre secciones no repite peticiones.
- **Accesibilidad:** landmarks semánticos y enlace "Saltar al contenido principal".

## 💡 Ejemplos de uso

Agregar una sección nueva:

```jsx
// router/routes.jsx
{ path: 'salidas-pedagogicas', element: <OutingsPage /> },
```
