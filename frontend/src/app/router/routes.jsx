import { RootLayout } from '@/app/layout/RootLayout.jsx'
import { RUTAS } from '@/app/navegacion.js'
import { AlianzasPage } from '@/pages/AlianzasPage.jsx'
import { ContactoPage } from '@/pages/ContactoPage.jsx'
import { ErrorPage } from '@/pages/ErrorPage.jsx'
import { FechasConmemorativasPage } from '@/pages/FechasConmemorativasPage.jsx'
import { GaleriaPage } from '@/pages/GaleriaPage.jsx'
import { InicioPage } from '@/pages/InicioPage.jsx'
import { MuseoPage } from '@/pages/MuseoPage.jsx'
import { NoEncontradaPage } from '@/pages/NoEncontradaPage.jsx'
import { QueEsPage } from '@/pages/QueEsPage.jsx'
import { ReconocimientosPage } from '@/pages/ReconocimientosPage.jsx'
import { SalidasPedagogicasPage } from '@/pages/SalidasPedagogicasPage.jsx'
import { VisitasYEventosPage } from '@/pages/VisitasYEventosPage.jsx'

/**
 * Configuración declarativa de rutas.
 * Se exporta como datos para reutilizarla tanto en el router del navegador
 * como en routers en memoria durante las pruebas.
 */
export const routes = [
  {
    path: RUTAS.inicio,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <InicioPage /> },
          { path: RUTAS.queEs, element: <QueEsPage /> },
          { path: RUTAS.museo, element: <MuseoPage /> },
          { path: RUTAS.salidas, element: <SalidasPedagogicasPage /> },
          { path: RUTAS.fechas, element: <FechasConmemorativasPage /> },
          { path: RUTAS.eventos, element: <VisitasYEventosPage /> },
          { path: RUTAS.reconocimientos, element: <ReconocimientosPage /> },
          { path: RUTAS.alianzas, element: <AlianzasPage /> },
          { path: RUTAS.galeria, element: <GaleriaPage /> },
          { path: RUTAS.contacto, element: <ContactoPage /> },
          { path: '*', element: <NoEncontradaPage /> },
        ],
      },
    ],
  },
]
