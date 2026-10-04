# 🧩 src/shared/

## 📖 Introducción

Código reutilizable por cualquier página, feature o entidad. No depende de ningún dominio concreto del portal.

## 🗂️ Archivos

| Archivo                      | Qué hace                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `api/httpClient.js`          | `createHttpClient()` y `ApiError`: cliente JSON sobre `fetch`                     |
| `api/apiClient.js`           | Instancia única del cliente configurada con la URL de la API                      |
| `api/recursos.js`            | `crearRecurso(ruta)` y `recursos`: opciones de TanStack Query para cada colección |
| `api/media.js`               | Rutas de medios propios: `fuentesDeImagen`, `miniaturaDeImagen`, `urlPublica`     |
| `config/env.js`              | Lectura centralizada de variables de entorno (`VITE_*`, `BASE_URL`)               |
| `lib/fechas.js`              | `formatearFecha`, `fechaParaAtributo`, `partesDeCalendario` (fechas parciales)    |
| `lib/embeds.js`              | YouTube (sin cookies), SoundCloud y nombre de la plataforma de un enlace          |
| `lib/agrupar.js`             | `agruparPor(lista, clave)` conservando el orden                                   |
| `lib/useFiltroEnUrl.js`      | Hook: un filtro guardado en la URL (`?tipo=medios`)                               |
| `ui/Contenedor.jsx`          | Ancho máximo y márgenes comunes                                                   |
| `ui/EncabezadoDePagina.jsx`  | `<h1>`, entradilla y `<title>` de cada página                                     |
| `ui/Seccion.jsx`             | Región con `<h2>` asociado (`aria-labelledby`)                                    |
| `ui/EstadoDeConsulta.jsx`    | Cargando, error con «Reintentar», vacío y datos, para cualquier consulta          |
| `ui/Esqueleto.jsx`           | Marcador de carga                                                                 |
| `ui/ImagenResponsiva.jsx`    | `<img>` con `srcset`, `sizes`, carga diferida y decodificación asíncrona          |
| `ui/Visor.jsx`               | Visor modal sobre `<dialog>` con navegación por teclado                           |
| `ui/useNavegacionEnLista.js` | Estado del visor: elemento abierto, anterior y siguiente                          |
| `ui/FiltroDeOpciones.jsx`    | Botones de filtro con `aria-pressed`                                              |
| `ui/EnlaceBoton.jsx`         | Enlace interno o externo con aspecto de botón                                     |
| `ui/Etiqueta.jsx`            | Etiqueta de color                                                                 |
| `ui/Icono.jsx`               | Íconos de línea en SVG                                                            |

## 🎯 Problema que resuelve

Evita que cada sección reimplemente la comunicación HTTP, la caché, el formato de fechas, los estados de carga o los componentes de interfaz.

## 🔗 Dependencias

`react`, `react-router` (solo `EnlaceBoton` y `useFiltroEnUrl`) y `@tanstack/react-query` (solo `recursos.js`).

## 🛠️ Cómo lo soluciona

- **`crearRecurso('eventos')`** devuelve `lista(filtros)`, `detalle(slug)` y `listaInfinita(filtros)` como `queryOptions`. Las claves de caché, las rutas y la paginación se definen una sola vez para las siete colecciones.
- **`media.js`** es el único que sabe dónde viven los archivos (`media/x` → `/media/x-sm.webp` y `-lg.webp`). Si mañana se mueven a un almacenamiento externo, solo cambia aquí.
- **`EstadoDeConsulta`** resuelve los estados de cualquier consulta; las secciones solo describen qué mostrar con datos.
- **Privacidad:** los videos usan `youtube-nocookie.com` y ningún reproductor de terceros se carga hasta que el visitante lo abre.
- **Accesibilidad:** el visor usa `<dialog>` nativo (atrapa el foco, cierra con Escape y devuelve el foco), los filtros anuncian su estado y las imágenes declaran `alt`.
- **`fetch` perezoso:** `createHttpClient` resuelve `fetch` en cada petición, así funcionan los dobles de prueba y los polyfills.

## 💡 Ejemplos de uso

```jsx
import { useQuery } from '@tanstack/react-query'
import { recursos } from '@/shared/api/recursos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'

function Medios() {
  const consulta = useQuery(recursos.eventos.lista({ tipo: 'medios' }))
  return (
    <EstadoDeConsulta consulta={consulta}>
      {({ elementos }) => elementos.map((e) => <p key={e.id}>{e.nombre}</p>)}
    </EstadoDeConsulta>
  )
}
```

```js
formatearFecha({ anio: 2023, mes: 10 }) // 'octubre de 2023'
formatearFecha({ mes: 4, dia: 9 }) // '9 de abril'
fuentesDeImagen('media/museo/2025-danza').srcSet // '/media/...-sm.webp 480w, ...-lg.webp 1280w'
```
