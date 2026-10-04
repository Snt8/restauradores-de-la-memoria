# 📋 docs/: Primera entrega evaluable

## 📖 Introducción

Mapa entre lo que pide la primera entrega (`.claude/instructions.md` y la guía del docente) y dónde está resuelto en el portal. Sirve para preparar la presentación y para revisar qué falta.

## 🗂️ Archivos

| Archivo     | Qué contiene                                             |
| ----------- | -------------------------------------------------------- |
| `README.md` | Cumplimiento de la entrega, pendientes y guía de la demo |

## 🎯 Problema que resuelve

Que el equipo pueda demostrar, punto por punto, que el prototipo cumple lo pedido, y sepa con claridad qué depende de ellos antes de entregar.

## 🔗 Dependencias

Ninguna: es documentación.

## 🛠️ Cómo lo soluciona

### ✅ Lo que pide la entrega y dónde está

| Requisito                                    | Dónde se cumple                                                                                     |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Prototipo funcional y navegable              | SPA en React con 13 rutas, menú de escritorio y móvil (`frontend/src/app/`)                          |
| Diseño UX/UI inicial y jerarquía visual      | Sistema de diseño en `frontend/src/styles/`, contraste WCAG AA, foco visible, movimiento reducido   |
| Diseño adaptable                             | Diseño _mobile first_ con Tailwind; probado a 375 px y en escritorio                                 |
| Inicio (nombre, colegio, imagen, accesos)    | `InicioPage.jsx`: portada con imagen, lema, acceso al Museo Virtual y a todas las secciones          |
| ¿Qué es? (qué, propósito, importancia, actividades, participantes) | `QueEsPage.jsx` + `content/sitio.js` + formación docente desde la API          |
| Museo Escolar (info, objetos, fotos, evidencias, créditos, acceso) | `MuseoPage.jsx` y la ficha `ObjetoMuseoPage.jsx`                               |
| Salidas pedagógicas                          | `/salidas-pedagogicas`: 8 salidas agrupadas por año, con lugar y fotos                              |
| Fechas conmemorativas                        | `/fechas-conmemorativas`: 5 fechas como hojas de calendario, con fotos                              |
| Visitas y eventos                            | `/visitas-y-eventos`: 27 registros con filtro (visitas, eventos, medios)                            |
| Reconocimientos                              | `/reconocimientos`: 7 reconocimientos con otorgante, fecha y evidencias                             |
| Alianzas institucionales                     | `/alianzas`: 5 aliados con logo, descripción y sitio web                                            |
| Galería multimedia                           | `/galeria`: 135 evidencias (fotos, videos, audios, enlaces) con filtros por sección y tipo          |
| Contacto                                     | `/contacto`: información institucional y formulario validado que se guarda en la base de datos     |
| Museo Virtual (espacio, objetos, info, fotos, créditos) | `/museo/virtual`: sala A-Frame con pedestales, cuadros, ficha, visita guiada y modo VR    |
| Mínimo 2 objetos 3D                          | ⚠️ Dos modelos **provisionales** listos; faltan los escaneos del equipo (ver pendientes)            |
| Base de datos (8 entidades)                  | PostgreSQL con migración Alembic: ver el diagrama en `backend/app/infrastructure/README.md`         |
| No inventar información                      | Todo el contenido sale de la presentación y del archivo de evidencias (`backend/seeds/datos/`)      |

### ⚠️ Pendientes que dependen del equipo

1. **Los 2 objetos 3D propios.** Escanearlos con Luma AI, Polycam o KIRI Engine, optimizarlos (ver `assets-pipeline/README.md`), copiarlos a `frontend/public/models/` y editar `backend/seeds/datos/objetos_museo.json` (nombre, descripción, importancia para la memoria, créditos y fotografía).
2. **Validar con el docente los textos de `frontend/src/content/sitio.js`** (qué es, propósito, participantes).
3. **Confirmar datos que las fuentes no traen:** la fecha de algunas salidas y eventos (aparecen como «Fecha por confirmar»), el nombre de la conmemoración del 31 de agosto y el sentido de la del 28 de abril.
4. **Agregar los nombres del equipo** en los créditos (`MUSEO.creditos` en `content/sitio.js` y el pie de página).
5. **Autorización de imagen:** muchas fotos muestran estudiantes menores de edad. Confirmar con el colegio que su publicación está autorizada antes de publicar el portal.

## 💡 Ejemplos de uso

### 🎬 Guion sugerido para la demo (5 minutos)

1. **Inicio** → portada, lema y accesos.
2. **¿Qué es?** → propósito, por qué conservar la memoria, quiénes participan.
3. **Museo Escolar** → ediciones 2021 a 2026 con fotos y videos; abrir una foto en el visor.
4. **Museo Virtual** → caminar con WASD, clic en un objeto (ficha), «Comenzar la visita», clic en un cuadro.
5. **Ficha de un objeto** → girar el modelo 3D arrastrando.
6. **Visitas y eventos** → filtrar «En los medios» y escuchar un episodio de El Guateque.
7. **Galería** → filtrar por «Salidas pedagógicas».
8. **Contacto** → enviar el formulario y mostrar el registro en la base de datos.
9. **Calidad** → mostrar la CI en verde y `pytest` / `npm test` corriendo.
