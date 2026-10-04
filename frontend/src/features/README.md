# ⚙️ src/features/

## 📖 Introducción

Funcionalidades con lógica propia, una carpeta por dominio. Cada una consulta la API, decide cómo organizar los datos y los presenta.

## 🗂️ Archivos

| Archivo                                   | Qué hace                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `museo/ObjetosDelMuseo.jsx`               | Cuadrícula de objetos del museo                                                |
| `museo/TarjetaDeObjeto.jsx`               | Tarjeta de un objeto con enlace a su ficha                                     |
| `museo/Exposiciones.jsx`                  | Ediciones del Museo Escolar y exposiciones externas (con `limite` opcional)    |
| `actividades/SalidasPorAnio.jsx`          | Línea de tiempo de salidas pedagógicas agrupadas por año                       |
| `actividades/CalendarioConmemorativo.jsx` | Fechas conmemorativas como hojas de calendario                                 |
| `eventos/EventosFiltrables.jsx`           | Visitas, eventos y medios con filtro por tipo guardado en la URL               |
| `galeria/GaleriaMultimedia.jsx`           | Galería con filtros por sección y tipo, y carga progresiva                     |
| `visitantes/validacion.js`                | Reglas del formulario (`validarVisitante`) y armado de la carga (`aCargaUtil`) |
| `museo-virtual/`                          | Museo Virtual en A-Frame: ver [su README](museo-virtual/README.md)             |
| `visitantes/FormularioVisitante.jsx`      | Formulario de contacto o libro de visitas, según `origen`                      |

## 🎯 Problema que resuelve

Separa la lógica de cada sección (qué pedir, cómo agrupar, qué validar) de la composición de la página.

## 🔗 Dependencias

`@tanstack/react-query`, `src/entities/*`, `src/shared/*`. Una feature no importa de otra feature.

## 🛠️ Cómo lo soluciona

- **Filtros en la API, no en el navegador:** `EventosFiltrables` y `GaleriaMultimedia` envían `tipo` y `seccion` a la API; el filtro vive en la URL para compartirlo o volver atrás.
- **Carga progresiva:** la galería usa `useInfiniteQuery` con páginas de 24 evidencias.
- **Un formulario, dos usos (OCP):** `FormularioVisitante` sirve para contacto (`origen="contacto"`, mensaje obligatorio) y para el libro de visitas del museo (`origen="libro_visitas"`).
- **Validación accesible:** cada error queda junto a su campo (`aria-invalid` y `aria-describedby`) y el foco va al primero con error. La API vuelve a validar.

## 💡 Ejemplos de uso

```jsx
<EventosFiltrables />              // /visitas-y-eventos?tipo=medios
<GaleriaMultimedia />              // /galeria?seccion=salidas&tipo=foto
<FormularioVisitante origen="libro_visitas" />
```
