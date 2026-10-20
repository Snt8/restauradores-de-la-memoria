# 📄 src/pages/

## 📖 Introducción

Una página por cada sección del portal. Las páginas **componen**: arman la pantalla con features, entidades y componentes compartidos.

## 🗂️ Archivos

| Archivo                        | Ruta                      | Qué muestra                                                                    |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------------------ |
| `InicioPage.jsx`               | `/`                       | Portada, presentación, accesos, exposiciones y reconocimientos                 |
| `QueEsPage.jsx`                | `/que-es`                 | Qué es, propósito, importancia, actividades, participantes y formación docente |
| `MuseoVirtualPage.jsx`         | `/museo/virtual`          | Sala 3D, visita guiada, lista de objetos y libro de visitas (ruta diferida)    |
| `ObjetoMuseoPage.jsx`          | `/museo/objetos/:slug`    | Ficha: modelo 3D, foto, descripción, importancia, créditos y evidencias        |
| `MuseoPage.jsx`                | `/museo`                  | Presentación, objetos, ediciones con evidencias y créditos                     |
| `SalidasPedagogicasPage.jsx`   | `/salidas-pedagogicas`    | Salidas agrupadas por año                                                      |
| `FechasConmemorativasPage.jsx` | `/fechas-conmemorativas`  | Calendario de conmemoraciones                                                  |
| `VisitasYEventosPage.jsx`      | `/visitas-y-eventos`      | Visitas, eventos y medios con filtro                                           |
| `ReconocimientosPage.jsx`      | `/reconocimientos`        | Reconocimientos con otorgante y evidencias                                     |
| `AlianzasPage.jsx`             | `/alianzas`               | Aliados con logo, sitio web y evidencias                                       |
| `GaleriaPage.jsx`              | `/galeria`                | Galería multimedia filtrable                                                   |
| `ContactoPage.jsx`             | `/contacto`               | Información institucional y formulario                                         |
| `ForoPage.jsx`                 | `/foro`                   | Foro estilo Reddit: categorías, muro con votos y órdenes, panel con normas     |
| `PublicacionForoPage.jsx`      | `/foro/publicaciones/:id` | Publicación completa con comentarios en hilo                                   |
| `NuevaPublicacionForoPage.jsx` | `/foro/publicar`          | Formulario para crear una publicación                                          |
| `NoEncontradaPage.jsx`         | `*`                       | Página 404                                                                     |
| `ErrorPage.jsx`                | —                         | Error inesperado al cargar o dibujar una página                                |
| `museo.test.jsx`               | —                         | Integración del Museo Virtual y de la ficha (A-Frame simulado)                 |
| `secciones.test.jsx`           | —                         | Pruebas de integración de cada sección con la API simulada                     |
| `foro.test.jsx`                | —                         | Integración del foro: muro, filtros, votos, hilos, publicar e inicio           |

## 🎯 Problema que resuelve

Da un punto de entrada claro por URL y separa la **composición** de una pantalla de la **lógica** de cada dominio.

## 🔗 Dependencias

`src/features/*`, `src/entities/*`, `src/shared/*`, `src/content/*`, `src/app/navegacion.js`.

## 🛠️ Cómo lo soluciona

- **Misma estructura en todo el sitio:** cada página es una `PlantillaDePagina` con una `PortadaDePagina` (banda de color, ícono, `<h1>`, `<title>`, descripción y acciones), el contenido en tarjetas y un panel derecho contextual (índice «En esta página», próxima conmemoración, invitación al foro…). El Museo Virtual y la galería no llevan panel para aprovechar el ancho.
- **Listados como muro:** eventos, salidas, exposiciones y reconocimientos se leen en una sola columna, como las publicaciones del foro.
- Los títulos salen de `app/navegacion.js`: el menú, el pie y la página nunca se contradicen.
- Las páginas que solo listan una colección (reconocimientos, alianzas) consultan con `recursos` directamente; las que tienen lógica (agrupar, filtrar, validar) delegan en una feature.

## 💡 Ejemplos de uso

```jsx
export function ReconocimientosPage() {
  return (
    <PlantillaDePagina
      portada={<PortadaDePagina titulo={PAGINAS.reconocimientos.etiqueta} icono="trofeo" />}
      panel={<EnEstaPagina secciones={[{ id: 'gala', etiqueta: 'Gala de los Mejores' }]} />}
    >
      <TarjetaDeContenido id="gala" titulo="Gala de los Mejores" />
    </PlantillaDePagina>
  )
}
```
