# 🎨 Frontend: Portal Restauradores de la Memoria

## 📖 Introducción

Aplicación de una sola página (SPA) que presenta el portal y el Museo Virtual de la Memoria. Está construida con **React 19 + Tailwind CSS 4 + Vite**.

## 🗂️ Archivos y carpetas

| Ruta                                     | Qué hace                                                              |
| ---------------------------------------- | --------------------------------------------------------------------- |
| 📁 [`src/app/`](src/app/README.md)       | Arranque de la app: providers, router y layout base                   |
| 📁 [`src/pages/`](src/pages/README.md)   | Una página por sección del portal; solo compone features              |
| 📁 [`src/shared/`](src/shared/README.md) | Código reutilizable: cliente HTTP, configuración y UI compartida      |
| 📁 [`src/test/`](src/test/README.md)     | Utilidades y setup de pruebas                                         |
| 📁 `src/styles/`                         | CSS global y tokens de Tailwind (`@theme`)                            |
| 📄 `src/main.jsx`                        | Punto de entrada: monta providers y router                            |
| 📄 `vite.config.js`                      | Plugins (React, Tailwind), alias `@`, proxy `/api` y config de Vitest |
| 📄 `.oxlintrc.json`                      | Reglas de lint                                                        |
| 📄 `.prettierrc.json`                    | Formato (con orden automático de clases Tailwind)                     |
| 📄 `.env.example`                        | Variables de entorno disponibles                                      |

Más adelante se sumarán `src/features/` (una carpeta por dominio: museo, salidas, eventos...) y `src/museum/` (escena A-Frame).

## 🎯 Problema que resuelve

Ofrecer al visitante una experiencia clara, accesible y adaptable a cualquier dispositivo para recorrer la memoria institucional y el museo 3D.

## 🔗 Dependencias

| Paquete                                 | Para qué                        |
| --------------------------------------- | ------------------------------- |
| `react`, `react-dom`                    | UI                              |
| `react-router`                          | Navegación entre secciones      |
| `@tanstack/react-query`                 | Caché y estado de datos remotos |
| `tailwindcss`, `@tailwindcss/vite`      | Estilos                         |
| `vitest`, `@testing-library/*`, `jsdom` | Pruebas                         |
| `oxlint`, `prettier`                    | Calidad de código               |

## 🛠️ Cómo lo soluciona

Capas con dependencias en una sola dirección: **pages → features → shared**. Las páginas no saben cómo se obtienen los datos, las features exponen hooks y `shared/api` es el único lugar que habla HTTP.

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
