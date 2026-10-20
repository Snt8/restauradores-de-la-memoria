# 💬 src/features/foro/

## 📖 Introducción

El **Foro de la Memoria**: un espacio para que estudiantes, docentes, familias y visitantes conversen sobre el proyecto. Su diseño sigue a Reddit: muro de publicaciones con votos, categorías, órdenes (populares, recientes, más votadas) y comentarios en hilo que se pueden contraer.

---

## 🗂️ Archivos

| Archivo                      | Qué hace                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `MuroDelForo.jsx`            | Muro paginado de una categoría (o de todas) en el orden elegido, con estado vacío y esqueleto |
| `TarjetaDePublicacion.jsx`   | Publicación en el muro: votos a la izquierda (abajo en móvil), contexto, título, extracto     |
| `CategoriasDelForo.jsx`      | Categorías: píldoras deslizables en móvil, columna fija desde `lg`                            |
| `PanelDelForo.jsx`           | Columna derecha: «Acerca del foro», botón de publicar y normas de convivencia                 |
| `AtajoParaPublicar.jsx`      | Barra «Crea una publicación…» sobre el muro                                                   |
| `ControlDeVoto.jsx`          | Flechas de voto y puntaje, en columna o en fila (solo presentación)                           |
| `useVoto.js`                 | Voto optimista: cambia al instante, confirma con la API y revierte si falla                   |
| `MetadatosDePublicacion.jsx` | Línea «categoría · Publicado por X · hace 3 horas» e `InstanteRelativo`                       |
| `HiloDeComentarios.jsx`      | Comentarios anidados con línea de hilo clicable, botón [−]/[+] y respuesta en línea           |
| `FormularioComentario.jsx`   | Comentar o responder (`padreId`); recarga el hilo y el contador                               |
| `FormularioPublicacion.jsx`  | Crear una publicación: categoría (radios), título, contenido y firma                          |
| `useFormularioForo.js`       | Estado común de los formularios: datos, errores, foco en el primer error y envío              |
| `BotonCompartir.jsx`         | Menú nativo de compartir o copia del enlace al portapapeles                                   |
| `Avatar.jsx`                 | Inicial de quien firma sobre un color estable por nombre                                      |
| `ForoDestacado.jsx`          | Las tres conversaciones más activas, para la página de inicio                                 |
| `arbol.js`                   | `armarHilo` (lista plana → árbol ordenado) y `contarRespuestas`                               |
| `identidad.js`               | Id anónimo de votante (UUID) y firma recordada, en `localStorage` con respaldo en memoria     |
| `validacion.js`              | `validarPublicacion`, `validarComentario`, `recortar` y `LIMITES_FORO` (los mismos de la API) |
| `estilos.js`                 | Clases compartidas (`CLASE_TARJETA_FORO`, `CLASE_ACCION`) y `textoDeComentarios`              |

Las páginas que lo usan están en `src/pages/`: `ForoPage`, `PublicacionForoPage` y `NuevaPublicacionForoPage`. Los textos fijos (categorías, órdenes y normas) viven en `src/content/foro.js`, y las llamadas a la API en `src/shared/api/foro.js`.

---

## 🎯 Problema que resuelve

El portal solo mostraba información; el foro deja que la comunidad **participe**: pregunte, comparta recuerdos y comente lo que vivió en las salidas y el museo, con la información fácil de recorrer y de leer.

## 🔗 Dependencias

`@tanstack/react-query`, `react-router`, `src/shared/*` (API, `CampoDeFormulario`, `FiltroDeOpciones`, `Etiqueta`, `Icono`) y `src/content/foro.js`. No importa de otras features.

---

## 🛠️ Cómo lo soluciona

- **Distribución de Reddit, adaptable:** tres columnas desde `lg` (categorías · muro · panel), una sola en móvil y tablet. En móvil los votos pasan de la columna izquierda a una píldora junto a las acciones.
- **Sin cuentas:** cada navegador genera un UUID (`identidad.js`) que la API usa para garantizar **un voto por persona y elemento** y para devolver el voto propio (`mi_voto`). La firma se recuerda para no pedirla en cada comentario.
- **Votos optimistas:** `useVoto` actualiza el puntaje al hacer clic; el muro no se reordena mientras alguien vota (se marca como desactualizado y se refresca al volver).
- **Hilos en el cliente:** la API entrega los comentarios planos; `armarHilo` los anida y ordena cada nivel (mejor votados, o más recientes).
- **Estado en la URL:** categoría, orden del muro y orden de comentarios (`?categoria=museo&orden=recientes`) se pueden compartir y sobreviven a «atrás».
- **Accesibilidad:** los votos son botones con `aria-pressed`; el puntaje se anuncia con `aria-live`; cada comentario es un `article` con el nombre de su autor; contraer un hilo tiene botón con `aria-expanded`; los formularios llevan el foco al primer error.

---

## 💡 Ejemplos de uso

```jsx
<MuroDelForo categoria="museo" orden="recientes" />
<FormularioComentario publicacionId={12} padreId={40} onCancelar={cerrar} />

const voto = useVoto({ objetivo: 'comentario', id: 40, puntaje: 3, miVoto: 0 })
<ControlDeVoto voto={voto} orientacion="horizontal" />

armarHilo(comentarios, 'recientes') // [{ ...comentario, respuestas: [...] }]
```
