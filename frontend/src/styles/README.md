# 🎨 src/styles/

## 📖 Introducción

Estilos globales e identidad visual del portal, definidos como tokens de Tailwind CSS 4.

## 🗂️ Archivos

| Archivo     | Qué hace                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `index.css` | Fuentes, tokens `@theme` (colores, tipografías, radios, sombras), estilos base y movimiento reducido |

## 🎯 Problema que resuelve

Que colores, tipografías y espaciados no se repitan como valores sueltos en cada componente, y que la identidad visual se cambie en un solo lugar.

## 🔗 Dependencias

`tailwindcss`, `@fontsource-variable/fraunces` (títulos) y `@fontsource-variable/inter` (texto). Las fuentes se sirven desde el propio sitio: no se consulta a Google Fonts.

## 🛠️ Cómo lo soluciona

- **Paleta tomada de la presentación del proyecto:** negro (`noche`), verde azulado (`memoria`), amarillo (`vela`) y rosa (`rosa`) sobre un fondo de papel de archivo (`papel`).
- **Contraste WCAG AA:** el texto `memoria` sobre `papel` supera 6:1 y `tinta-suave` supera 7:1.
- **Foco visible** en todo elemento interactivo y **`prefers-reduced-motion`** respetado.
- Prettier ordena las clases con `tailwindStylesheet` apuntando a este archivo, así reconoce los tokens propios.

## 💡 Ejemplos de uso

```jsx
<p className="bg-papel-hondo text-tinta-suave font-display">…</p>
<a className="text-memoria hover:text-memoria-hondo">…</a>
```
