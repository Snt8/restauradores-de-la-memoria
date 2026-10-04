# 🎨 Frontend: Portal Restauradores de la Memoria

## 📖 Introducción

Aplicación de una sola página (SPA) que presenta el portal y el Museo Virtual de la Memoria. Está construida con **React 19 + Tailwind CSS 4 + Vite**.

## 🗂️ Archivos y carpetas

| Ruta                                         | Qué hace                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| 📁 [`src/app/`](src/app/README.md)           | Arranque: mapa del sitio, providers, router y layout                         |
| 📁 [`src/pages/`](src/pages/README.md)       | Una página por sección del portal; solo compone                              |
| 📁 [`src/features/`](src/features/README.md) | Funcionalidades con lógica: museo, actividades, eventos, galería, visitantes |
| 📁 [`src/entities/`](src/entities/README.md) | UI de conceptos del dominio que se repiten: evidencias y contenido fechado   |
| 📁 [`src/shared/`](src/shared/README.md)     | Código reutilizable: API, utilidades y componentes de interfaz               |
| 📁 [`src/content/`](src/content/README.md)   | Textos institucionales fijos                                                 |
| 📁 [`src/styles/`](src/styles/README.md)     | Identidad visual: tokens de Tailwind (`@theme`) y estilos base               |
| 📁 [`src/test/`](src/test/README.md)         | API simulada, datos de prueba y utilidades de renderizado                    |
| 📁 `public/media/`                           | Imágenes WebP generadas por `assets-pipeline`                                |
| 📁 `public/models/`                          | Modelos 3D (`.glb`) del museo                                                |
| 📄 `src/main.jsx`                            | Punto de entrada: monta providers y router                                   |
| 📄 `vite.config.js`                          | Plugins (React, Tailwind), alias `@`, proxy `/api` y config de Vitest        |
| 📄 `.oxlintrc.json`                          | Reglas de lint                                                               |
| 📄 `.prettierrc.json`                        | Formato (con orden automático de clases Tailwind)                            |
| 📄 `.env.example`                            | Variables de entorno disponibles                                             |

## 🎯 Problema que resuelve

Ofrecer al visitante una experiencia clara, accesible y adaptable a cualquier dispositivo para recorrer la memoria institucional y el museo 3D.

## 🔗 Dependencias

| Paquete                                 | Para qué                             |
| --------------------------------------- | ------------------------------------ |
| `react`, `react-dom`                    | UI                                   |
| `react-router`                          | Navegación entre secciones           |
| `@tanstack/react-query`                 | Caché y estado de datos remotos      |
| `tailwindcss`, `@tailwindcss/vite`      | Estilos                              |
| `@fontsource-variable/*`                | Fuentes servidas desde el sitio      |
| `aframe`                                | Museo Virtual en 3D (carga diferida) |
| `vitest`, `@testing-library/*`, `jsdom` | Pruebas                              |
| `oxlint`, `prettier`                    | Calidad de código                    |

## 🛠️ Cómo lo soluciona

Capas con dependencias en una sola dirección:

```
pages ──▶ features ──▶ entities ──▶ shared
  └──────────┴────────────┴──────────▶ content
```

- **`shared/api`** es el único lugar que habla HTTP; `recursos.js` describe cada colección como opciones de TanStack Query.
- Las **páginas** no hacen peticiones ni contienen reglas: componen.
- Una **feature** no importa de otra; lo que comparten vive en `entities` o `shared`.
- El contenido de las secciones llega de la API; solo los textos institucionales fijos viven en `content/`.

## 💡 Ejemplos de uso

```bash
npm run dev           # servidor de desarrollo (http://localhost:5173)
npm test              # pruebas una vez
npm run test:watch    # pruebas en modo observador
npm run lint          # lint
npm run format        # formatear el código
npm run build         # build de producción en dist/
```

Importar con el alias `@` (apunta a `src/`):

```js
import { apiClient } from '@/shared/api/apiClient.js'
```
