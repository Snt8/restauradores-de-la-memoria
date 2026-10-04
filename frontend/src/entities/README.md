# 🧱 src/entities/

## 📖 Introducción

Piezas de interfaz ligadas a un **concepto del dominio** que se repite en varias secciones: las evidencias (fotos, videos, audios, enlaces) y el contenido fechado (eventos, salidas, exposiciones, reconocimientos…).

## 🗂️ Archivos

| Archivo                              | Qué hace                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `evidencia/evidencia.js`             | `presentacionDeEvidencia()`: decide si una evidencia es imagen, video, audio o enlace; `primeraFoto()` |
| `evidencia/MiniaturaDeEvidencia.jsx` | Botón cuadrado con la vista previa (sin cargar contenido de terceros)                                  |
| `evidencia/VistaDeEvidencia.jsx`     | Evidencia completa dentro del visor, con descripción y créditos                                        |
| `evidencia/GaleriaDeEvidencias.jsx`  | Cuadrícula de miniaturas + visor navegable                                                             |
| `contenido/Fecha.jsx`                | `<time>` con la fecha parcial, o «Fecha por confirmar»                                                 |
| `contenido/TarjetaDeContenido.jsx`   | Tarjeta común: título, fecha, lugar, descripción, etiquetas y evidencias                               |

## 🎯 Problema que resuelve

Eventos, salidas, exposiciones, reconocimientos, formación, alianzas y la galería muestran evidencias y fechas. Sin esta capa, cada sección repetiría el mismo marcado y las mismas decisiones.

## 🔗 Dependencias

`src/shared/*`. Nunca importa de `features/` ni de `pages/`.

## 🛠️ Cómo lo soluciona

- **Una decisión, un lugar:** `presentacionDeEvidencia` concentra la regla «YouTube se incrusta, SoundCloud se incrusta, lo demás se enlaza». Miniatura y visor la consultan.
- **Composición:** `TarjetaDeContenido` acepta `etiquetas` e hijos (`children`) para que cada sección agregue lo suyo (tipo de evento, otorgante…) sin modificar la tarjeta (OCP).

## 💡 Ejemplos de uso

```jsx
<TarjetaDeContenido
  titulo={evento.nombre}
  fecha={evento.fecha}
  lugar={evento.lugar}
  descripcion={evento.descripcion}
  evidencias={evento.evidencias}
  etiquetas={<Etiqueta tono="rosa">Medios</Etiqueta>}
/>

<GaleriaDeEvidencias evidencias={exposicion.evidencias} densidad="amplia" />
```
