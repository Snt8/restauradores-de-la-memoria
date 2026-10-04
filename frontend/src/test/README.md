# 🧪 src/test/

## 📖 Introducción

Infraestructura compartida por todas las pruebas del frontend.

## 🗂️ Archivos

| Archivo           | Qué hace                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `setup.js`        | Registra los matchers de `jest-dom` y limpia el DOM después de cada prueba |
| `renderRoute.jsx` | Renderiza la app real (rutas + providers) en una URL dada                  |

## 🎯 Problema que resuelve

Sin una utilidad común, cada prueba de integración tendría que repetir el montaje de router, providers y caché.

## 🔗 Dependencias

`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `react-router`

## 🛠️ Cómo lo soluciona

`renderRoute(path)` usa `createMemoryRouter` con las **mismas** `routes` de producción y un `QueryClient` nuevo por prueba (sin reintentos). Las pruebas quedan aisladas entre sí y se comportan como la app real.

## 💡 Ejemplos de uso

```jsx
import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/renderRoute.jsx'

it('muestra el museo', () => {
  const { router } = renderRoute('/museo')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Museo')
  expect(router.state.location.pathname).toBe('/museo')
})
```

**Convención:** los archivos de prueba van junto al código que prueban (`*.test.js` o `*.test.jsx`).
