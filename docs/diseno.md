# 🎨 Propuesta de diseño: el portal con la estructura de Reddit

## 📖 Introducción

Todo el portal sigue la estructura del **Foro de la Memoria**, inspirada en Reddit: una barra superior, la navegación fija a la izquierda, el contenido en tarjetas blancas en el centro y un panel de contexto a la derecha. Los objetivos son tres: que **todo sea adaptable**, que haya **espacio suficiente** entre los bloques y que la información sea **fácil de leer y de encontrar**.

---

## 🧭 Principios

| Principio              | Cómo se aplica                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 🧱 Una sola estructura | Todas las páginas usan `PlantillaDePagina`: portada, contenido y panel. Quien aprende una sección ya sabe usar todas.  |
| 📱 Primero el móvil    | Cada vista se diseña a 375 px y se amplía en `sm` (640), `md` (768), `lg` (1024) y `xl` (1280). Sin scroll horizontal. |
| 🔤 Lectura cómoda      | Base de 17 px, interlineado amplio y párrafos limitados a ~68 caracteres (`max-w-lectura`).                            |
| 🌬️ Espacio que respira | Tarjetas con 20–32 px de relleno y 16–24 px entre ellas; listados en una columna, como un muro.                        |
| 🧭 Saber dónde estoy   | Menú con la página actual marcada, ruta de navegación en las subpáginas e índice «En esta página».                     |
| ♿ Accesible           | Contraste AA, foco visible, objetivos táctiles de 36–44 px y estados anunciados a lectores de pantalla.                |

---

## 🗺️ Estructura general

```
Escritorio (≥ 1280 px)
┌─────────────────── barra superior: ☰(móvil) · escudo + nombre · [Publicar en el foro] [Museo Virtual] ───────────────────┐
├────────────────┬─────────────────────────────────────────────────────────────────┬──────────────────────────┤
│ 🏠 Inicio      │ ┌── portada ─────────────────────────────────────────────┐      │                          │
│ 💬 Foro        │ │ banda de color (o foto en Inicio)                       │      │                          │
│ 🖼 Galería     │ │ (◎) ANTETÍTULO   Museo Escolar / Objeto                 │      │                          │
│ ── MUSEO ──    │ │ Título de la página (h1)                                │      │                          │
│ 🏛 Escolar     │ │ Descripción a ancho de lectura    [Acción] [Acción]     │      │                          │
│ ⬡ Virtual      │ └─────────────────────────────────────────────────────────┘      │                          │
│ ─ ACTIVIDADES ─│ ┌── contenido ──────────────────────┐   ┌── panel ──────────┐   │                          │
│ 📍 Salidas     │ │ tarjetas en una columna (muro)     │   │ Invitación al foro │   │                          │
│ 📅 Fechas      │ │ …                                  │   │ En esta página ▸   │   │  (fijo al desplazarse)   │
│ 👥 Visitas     │ └────────────────────────────────────┘   └────────────────────┘   │                          │
│ ─ EL PROYECTO ─│                                                                   │                          │
│ (fija)         │                                                                   │                          │
└────────────────┴─────────────────────────────────────────────────────────────────┴──────────────────────────┘

lg (1024–1279 px): navegación lateral + contenido; el panel pasa debajo del contenido.
Móvil y tablet: una sola columna; el menú se abre desde ☰ con los mismos grupos e íconos.
```

---

## 🎨 Sistema visual

Tokens en `frontend/src/styles/index.css` y clases en `frontend/src/shared/ui/estilos.js`:

| Pieza                              | Uso                                                          |
| ---------------------------------- | ------------------------------------------------------------ |
| `fondo-foro` + `superficie`        | Fondo de todas las páginas y tarjetas blancas con borde fino |
| `CLASE_TARJETA`                    | La tarjeta base de todo el portal                            |
| `CLASE_TARJETA_ENLAZADA`           | Tarjeta que es un enlace: se realza al pasar el mouse        |
| `memoria`, `vela`, `rosa`, `cielo` | Bandas de la portada por sección y etiquetas de categoría    |
| `container-lectura` (`68ch`)       | Ancho máximo de los párrafos largos                          |

Componentes:

- **`PortadaDePagina`**: banda de color (o foto), ícono redondo, ruta de navegación, `<h1>`, descripción y acciones. También fija el título de la pestaña.
- **`PlantillaDePagina`**: portada + contenido + panel. El panel es columna desde `xl` y pasa debajo en pantallas menores.
- **`Seccion`**: variante `tarjeta` para texto y `abierta` para listas de tarjetas.
- **`TarjetaPanel`** y **`EnEstaPagina`**: tarjetas del panel; el índice resalta la sección que se está leyendo y solo aparece cuando el panel es columna.
- **`TarjetaDeContenido`**: eventos, salidas, exposiciones y reconocimientos con la forma de una publicación del foro (contexto arriba, título, descripción, evidencias).

---

## 📄 Página por página

| Página                | Contenido central                                                     | Panel derecho                                                 |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| Inicio                | Presentación, «Desde el foro» (con votos), accesos, exposiciones      | Acerca del proyecto, reconocimientos recientes, Museo Virtual |
| ¿Qué es?              | Qué es, propósito, importancia, actividades, participantes, formación | Pregunta en el foro, índice                                   |
| Museo Escolar         | Sobre el museo, objetos, ediciones, créditos                          | Invitación al foro (Museo), índice                            |
| Museo Virtual         | Sala 3D a todo el ancho, visita guiada, libro de visitas              | — (sin panel, para aprovechar el ancho)                       |
| Ficha de un objeto    | Visor 3D, foto, descripción, importancia, evidencias                  | Ficha (fecha, créditos, exhibido en), foro                    |
| Salidas pedagógicas   | Muro agrupado por año                                                 | Invitación al foro (Salidas), índice por año con cantidad     |
| Fechas conmemorativas | Hojas de calendario                                                   | **Próxima conmemoración** y días que faltan, índice           |
| Visitas y eventos     | Filtro por tipo y muro                                                | Qué significa cada tipo, fotos de eventos, foro               |
| Reconocimientos       | Muro de reconocimientos                                               | Índice con año                                                |
| Alianzas              | Tarjetas de aliados con logo                                          | Índice de aliados                                             |
| Galería               | Filtros en tarjeta y cuadrícula a todo el ancho                       | — (sin panel)                                                 |
| Contacto              | Formulario                                                            | Información institucional, pregunta en el foro                |
| Foro                  | Categorías en píldoras, «Crea una publicación…», orden, muro          | Acerca del foro, normas de convivencia                        |

---

## 💬 Foro de la Memoria

- **Muro:** publicaciones con votos a la izquierda (en una píldora en móvil), categoría, autor, antigüedad, extracto, comentarios y compartir. Orden: Populares, Recientes, Más votadas.
- **Publicación:** texto completo, formulario de comentario y comentarios anidados con una línea vertical que **contrae el hilo**.
- **Crear publicación:** categorías como tarjetas con descripción, título con contador, contenido con ayuda y firma.

---

## ⚡ Optimización y experiencia

| Mejora                                 | Efecto                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Precarga al apuntar un enlace del menú | La sección se abre ya con datos, sin esqueletos (mismas claves de caché que la página).         |
| Página actual siempre marcada          | Una publicación marca «Foro»; la ficha de un objeto marca «Museo Escolar».                      |
| Ruta de navegación en subpáginas       | Volver al nivel superior en un clic.                                                            |
| Índice que sigue la lectura            | `IntersectionObserver` resalta la sección visible; el índice queda fijo al desplazarse.         |
| Próxima conmemoración                  | La página de fechas responde de inmediato «¿qué viene y cuándo?».                               |
| Accesos cruzados al foro               | Cada sección invita a conversar en la categoría que le corresponde.                             |
| Menos código                           | Se eliminaron `EncabezadoDePagina` y los menús desplegables: una sola plantilla y un solo menú. |

---

## ⚙️ Decisiones técnicas del foro

| Decisión                                 | Motivo                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Participación anónima con firma          | No exige cuentas para la primera versión; la firma no pide correo ni datos personales.     |
| Un UUID por navegador para votar         | La base garantiza un voto por persona y elemento (clave primaria `objetivo + votante`).    |
| Puntaje y contador desnormalizados       | El muro se ordena sin sumar votos en cada consulta; se recalculan en la misma transacción. |
| «Populares» = actividad / antigüedad^1,5 | Como el «hot» de Reddit: lo nuevo con actividad sube y lo viejo deja espacio.              |
| Hilos armados en el cliente              | La API devuelve los comentarios planos (una sola consulta) y el cliente los anida.         |

---

## 🚧 Pendientes para la siguiente entrega

- 🛡️ **Moderación del foro:** ocultar o borrar publicaciones y comentarios (requiere el panel de administración con autenticación).
- 🚦 **Límite de peticiones** por IP para frenar abusos en publicar y votar.
- 🔎 **Búsqueda** en el contenido del portal y del foro (requiere un endpoint de búsqueda).
- 📄 **Paginación de comentarios** si alguna conversación crece a cientos de respuestas.
- ✅ Validar con el docente las normas de convivencia (`frontend/src/content/foro.js`).
