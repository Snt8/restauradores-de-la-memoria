# 🏛️ src/features/museo-virtual/

## 📖 Introducción

El **Museo Virtual de la Memoria**: una sala en 3D hecha con A-Frame donde el visitante camina, se acerca a cada objeto del museo, consulta su ficha y mira en los muros las fotografías de las ediciones del Museo Escolar. Funciona con mouse, pantalla táctil y gafas de realidad virtual.

## 🗂️ Archivos

| Archivo                | Qué hace                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `sala.js`              | Geometría pura: límites, paradas de la visita, lugares en los muros, cuadros y giros       |
| `aframe.js`            | `cargarAframe()` (carga diferida, una sola vez) y componentes propios de A-Frame           |
| `hooks.js`             | `useEventoAframe`, `useProporciones` (medir fotos) y `useCamaraDelMuseo` (mover la cámara) |
| `EscenaMuseo.jsx`      | La escena: arquitectura, luces, cuadros, pedestales con modelos y cámara                   |
| `PanelDeObjeto.jsx`    | Ficha resumida del objeto elegido, en HTML sobre la escena                                 |
| `MuseoInteractivo.jsx` | Orquesta escena, panel, visita guiada, lista accesible de objetos y visor de fotos         |
| `VisorDeModelo.jsx`    | Visor 3D individual para la ficha de un objeto (gira solo y con arrastre)                  |
| `*.test.js`            | Pruebas de la geometría y de los componentes de A-Frame                                    |

## 🎯 Problema que resuelve

El proyecto necesita un museo que se pueda recorrer desde cualquier lugar, con los objetos digitalizados por el equipo, su información y créditos, y que crezca sin reescribir código cada vez que llega una pieza nueva.

## 🔗 Dependencias

`aframe` (carga diferida), `@tanstack/react-query`, `react-router`, `src/entities/evidencia`, `src/shared/*`.

## 🛠️ Cómo lo soluciona

- **La sala sale de la base de datos:** cada objeto trae su modelo (`modelo_3d_url`) y su ubicación (`x`, `y`, `z`, `rotacion_y`, `escala`). Los cuadros se eligen de las fotos de las exposiciones, alternando ediciones para que todas tengan presencia. Agregar una pieza es agregar una fila en `objetos_museo.json`.
- **Carga diferida:** A-Frame (~1,3 MB) va en su propio fragmento y se descarga solo al entrar al museo o a una ficha; el resto del portal no lo paga.
- **Interacción:** el cursor (`rayOrigin: mouse`) y los controles láser en VR lanzan rayos solo contra elementos `.interactivo`. Los clics llegan a React con `useEventoAframe`.
- **Visita guiada:** `paradasDelRecorrido` ubica al visitante frente a cada pieza y calcula hacia dónde mirar; `useCamaraDelMuseo` traslada el «rig» con una animación y orienta la cámara.
- **Sin atravesar muros:** el componente `limites-de-sala` acota la posición en cada cuadro.
- **Accesibilidad:** la ficha es HTML (legible y compatible con lectores de pantalla), hay una lista de objetos como alternativa a moverse en 3D, y la visita guiada anuncia cada parada (`aria-live`).
- **Rendimiento:** los muros usan la versión pequeña de cada foto (menos memoria de video en celulares); la grande se abre en el visor.
- **Enlaces directos:** `/museo/virtual?objeto=slug` abre la sala frente a ese objeto (la ficha de cada objeto enlaza así).
- **Lógica testeable sin WebGL:** toda la geometría vive en funciones puras (`sala.js`); los componentes de A-Frame delegan en ellas.

## 💡 Ejemplos de uso

```jsx
<MuseoInteractivo objetos={objetos} exposiciones={exposiciones} />
<VisorDeModelo objeto={objeto} />
```

```js
paradasDelRecorrido([{ slug: 'caja', nombre: 'Caja', orden: 1, ubicacion: { x: -2.2, z: -5 } }])
// [{ slug: 'caja', posicion: { x: -1.85, z: -2.8 }, rotacionY: 9.04, ... }]
```

Ubicar una pieza nueva en la sala (en `backend/seeds/datos/objetos_museo.json`):

```json
"ubicacion": { "x": 0, "y": 1.05, "z": -9, "rotacion_y": 0, "escala": 1.2 }
```

La sala mide 14 m de ancho (x de −7 a 7) y 16 m de fondo (z de 2 a −14); `y` es la altura de la base del objeto (los pedestales miden lo mismo).
