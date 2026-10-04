# 🧪 src/test/

## 📖 Introducción

Infraestructura compartida por todas las pruebas del frontend.

## 🗂️ Archivos

| Archivo           | Qué hace                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| `setup.js`        | Matchers de `jest-dom`, polyfill de `<dialog>`, `scrollTo` y limpieza tras cada prueba |
| `renderRoute.jsx` | Renderiza la app real (rutas + providers) en una URL dada                              |
| `apiFalsa.js`     | `instalarApiFalsa(rutas)`, `pagina()` y `respuestaJson()`: la API en memoria           |
| `fixtures.js`     | Constructores de datos con la forma de la API (`evento()`, `objeto()`, `evidencia()`…) |

## 🎯 Problema que resuelve

Sin una base común, cada prueba de integración repetiría el montaje de router, providers y caché, y simularía la API a su manera.

## 🔗 Dependencias

`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `react-router`

## 🛠️ Cómo lo soluciona

- **`renderRoute(path)`** usa `createMemoryRouter` con las **mismas** `routes` de producción y un `QueryClient` nuevo por prueba (sin reintentos).
- **`instalarApiFalsa`** reemplaza `fetch` (no el cliente HTTP): las pruebas recorren el código real de `httpClient`, `recursos` y TanStack Query. Registra cada petición para verificar ruta, método, parámetros y cuerpo. Lo no declarado responde `404`.
- **`fixtures.js`** da valores por defecto realistas; cada prueba sobrescribe solo lo que le importa.
- `vi.unstubAllGlobals()` tras cada prueba deja `fetch` como estaba.

## 💡 Ejemplos de uso

```jsx
import { instalarApiFalsa, pagina } from '@/test/apiFalsa.js'
import { evento } from '@/test/fixtures.js'
import { renderRoute } from '@/test/renderRoute.jsx'

it('filtra por tipo', async () => {
  const { peticiones } = instalarApiFalsa({
    eventos: ({ params }) => pagina([evento({ tipo: params.tipo ?? 'evento' })]),
    'POST visitantes': respuestaJson({ id: 1 }, 201),
  })
  renderRoute('/visitas-y-eventos?tipo=medios')

  expect(await screen.findByText('1 registro')).toBeInTheDocument()
  expect(peticiones[0].params.tipo).toBe('medios')
})
```

**Convención:** los archivos de prueba van junto al código que prueban (`*.test.js` o `*.test.jsx`).
