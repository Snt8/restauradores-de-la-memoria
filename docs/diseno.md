# 🎨 Propuesta de diseño: portal y Foro de la Memoria

## 📖 Introducción

Este documento describe el rediseño del portal y el nuevo **Foro de la Memoria**, inspirado en Reddit. Los objetivos fueron tres: que **todo sea adaptable** a cualquier pantalla, que haya **espacio suficiente** entre los bloques y que la información sea **fácil de leer**.

---

## 🧭 Principios

| Principio              | Cómo se aplica                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 📱 Primero el móvil    | Cada vista se diseña a 375 px y se amplía en `sm` (640), `md` (768), `lg` (1024) y `xl` (1280). Nunca hay scroll horizontal. |
| 🔤 Lectura cómoda      | Base de 17 px, interlineado amplio (`leading-relaxed`) y párrafos limitados a ~68 caracteres (`max-w-lectura`).              |
| 🌬️ Espacio que respira | Secciones de 64–96 px de alto margen, tarjetas con 24–32 px de relleno y cuadrículas con 24–32 px de separación.             |
| 🧩 Jerarquía clara     | Fraunces para los títulos de página, Inter para el texto y los elementos del foro; una sola acción principal por bloque.     |
| ♿ Accesible           | Contraste AA, foco visible, objetivos táctiles de 36–44 px y estados anunciados a lectores de pantalla.                      |

---

## 🎨 Sistema visual

Los tokens viven en `frontend/src/styles/index.css`:

| Token                               | Uso                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| `papel`, `papel-hondo`, `linea`     | Fondos y bordes cálidos de archivo                        |
| `tinta`, `tinta-suave`              | Texto principal y secundario                              |
| `memoria`, `vela`, `rosa`           | Colores de la identidad del proyecto                      |
| `cielo` (nuevo)                     | Categoría «Preguntas» y voto en contra                    |
| `superficie`, `fondo-foro` (nuevos) | Tarjetas blancas del foro sobre un fondo apenas más hondo |
| `container-lectura` (nuevo, `68ch`) | Ancho máximo de los párrafos largos                       |

Componentes compartidos ajustados:

- **`Contenedor`** admite `ancho="amplio"` (`max-w-7xl`) para diseños de varias columnas (foro, encabezado, pie).
- **`Seccion`** y **`EncabezadoDePagina`** ganan altura y títulos más grandes en pantallas medianas.
- **`TarjetaDeContenido`** y las cuadrículas de todas las secciones aumentan relleno y separación.
- **Menú principal**: 7 entradas (Inicio · El proyecto ▾ · Museo ▾ · Actividades ▾ · Galería · Foro · Contacto). «El proyecto» agrupa ¿Qué es?, Reconocimientos y Alianzas.

---

## 💬 Foro de la Memoria (estilo Reddit)

### Muro (`/foro`)

```
Escritorio (≥ 1024 px)
┌────────────────────────── portada: banda de color, escudo, título, «Crear publicación» ──────────────────────────┐
├──────────────┬──────────────────────────────────────────────┬──────────────────────┤
│ Categorías   │ [T] Crea una publicación…                 [+] │ Acerca del foro      │
│ ● Todas      │ (Populares) (Recientes) (Más votadas)         │ [Crear publicación]  │
│ ● General    │ ┌──┬──────────────────────────────────────┐   │                      │
│ ● Museo      │ │▲ │ Museo · Publicado por Ana · hace 2 h │   │ Normas de convivencia│
│ ● Salidas    │ │12│ Título de la publicación             │   │ 1. …                 │
│ ● Historias  │ │▼ │ Extracto de tres líneas…             │   │ 2. …                 │
│ ● Preguntas  │ │  │ 💬 4 comentarios   ⇪ Compartir        │   │                      │
│  (fija)      │ └──┴──────────────────────────────────────┘   │  (fija)              │
└──────────────┴──────────────────────────────────────────────┴──────────────────────┘

Móvil (375 px)
┌───────────────────────────┐
│ portada + Crear publicación│
│ (Todas)(General)(Museo)… → │  ← fila deslizable
│ [T] Crea una publicación…  │
│ (Populares)(Recientes)…    │
│ ┌───────────────────────┐ │
│ │ Museo · Ana · hace 2 h │ │
│ │ Título                 │ │
│ │ Extracto…              │ │
│ │ (▲ 12 ▼) 💬 4  ⇪       │ │  ← votos en píldora
│ └───────────────────────┘ │
│ Acerca del foro · Normas   │
└───────────────────────────┘
```

### Publicación (`/foro/publicaciones/:id`)

- Publicación completa con votos, título grande y texto a ancho de lectura.
- Formulario de comentario arriba y orden **Mejores / Recientes**.
- Comentarios anidados: avatar con inicial, línea vertical clicable que **contrae el hilo**, botón [−]/[+], votos y «Responder» en línea.

### Crear publicación (`/foro/publicar`)

- Categorías como tarjetas con descripción (radios), título con contador, contenido con ayuda y firma.
- Normas de convivencia a la derecha (abajo en móvil).

### Inicio

Nueva sección **«Desde el foro»** con las tres conversaciones más activas.

---

## ⚙️ Decisiones técnicas

| Decisión                                 | Motivo                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Participación anónima con firma          | No exige cuentas para la primera versión; la firma no pide correo ni datos personales.     |
| Un UUID por navegador para votar         | La base garantiza un voto por persona y elemento (clave primaria `objetivo + votante`).    |
| Puntaje y contador desnormalizados       | El muro se ordena sin sumar votos en cada consulta; se recalculan en la misma transacción. |
| «Populares» = actividad / antigüedad^1,5 | Como el «hot» de Reddit: lo nuevo con actividad sube y lo viejo deja espacio.              |
| Hilos armados en el cliente              | La API devuelve los comentarios planos (una sola consulta) y el cliente los anida.         |

---

## 🚧 Pendientes para la siguiente entrega

- 🛡️ **Moderación:** ocultar o borrar publicaciones y comentarios (requiere el panel de administración con autenticación).
- 🚦 **Límite de peticiones** por IP para frenar abusos en publicar y votar.
- 📄 **Paginación de comentarios** si alguna conversación crece a cientos de respuestas.
- ✅ Validar con el docente las normas de convivencia (`frontend/src/content/foro.js`).
