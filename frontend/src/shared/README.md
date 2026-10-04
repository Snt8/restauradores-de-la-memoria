# 🧩 src/shared/

## 📖 Introducción

Código reutilizable por cualquier feature o página. No depende de ninguna feature concreta.

## 🗂️ Archivos

| Archivo                  | Qué hace                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `api/httpClient.js`      | Fábrica `createHttpClient()` y clase `ApiError`              |
| `api/httpClient.test.js` | Pruebas unitarias del cliente HTTP                           |
| `api/apiClient.js`       | Instancia única del cliente configurada con la URL de la API |
| `config/env.js`          | Lectura centralizada de variables de entorno (`VITE_*`)      |

Más adelante: `ui/` con componentes compartidos (Card, Gallery, Lightbox, Timeline...).

## 🎯 Problema que resuelve

Evita que cada feature reimplemente la comunicación HTTP, el manejo de errores o la lectura de configuración.

## 🔗 Dependencias

Ninguna externa: usa `fetch` nativo.

## 🛠️ Cómo lo soluciona

**`createHttpClient({ baseUrl, fetchFn })`** devuelve `{ get, post }`:

- Une `baseUrl` y `path` sin barras duplicadas.
- Serializa `params` omitiendo `null` y `undefined`.
- Envía y recibe JSON. Una respuesta `204` devuelve `null`.
- Ante una respuesta no exitosa lanza `ApiError` con `status` y `body`.
- Ante un fallo de red lanza `ApiError` con `status: 0`.
- Deja pasar las cancelaciones (`AbortError`) sin envolverlas, para que TanStack Query las maneje.
- `fetchFn` se inyecta (DIP), así las pruebas no tocan la red.

## 💡 Ejemplos de uso

```js
import { apiClient } from '@/shared/api/apiClient.js'
import { ApiError } from '@/shared/api/httpClient.js'

const eventos = await apiClient.get('eventos', { params: { tipo: 'visita' } })

try {
  await apiClient.post('visitantes', { nombre: 'Ana', correo: 'ana@correo.co' })
} catch (error) {
  if (error instanceof ApiError && error.status === 422) {
    // mostrar errores de validación: error.body
  }
}
```
