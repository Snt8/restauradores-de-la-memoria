import { RootLayout } from '@/app/layout/RootLayout.jsx'
import { HomePage } from '@/pages/HomePage.jsx'
import { NotFoundPage } from '@/pages/NotFoundPage.jsx'

/**
 * Configuración declarativa de rutas.
 * Se exporta como datos para reutilizarla tanto en el router del navegador
 * como en routers en memoria durante las pruebas.
 */
export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
