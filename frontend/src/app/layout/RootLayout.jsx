import { Outlet, ScrollRestoration } from 'react-router'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { Encabezado } from './Encabezado.jsx'
import { NavegacionLateral } from './NavegacionLateral.jsx'
import { PieDePagina } from './PieDePagina.jsx'

const MAIN_CONTENT_ID = 'contenido-principal'

/**
 * Estructura de todas las páginas, como Reddit: barra superior, navegación lateral fija
 * (desde `lg`), contenido y pie. Cada página decide su portada y su panel derecho.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-fondo-foro">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:rounded-full focus:bg-vela focus:px-4 focus:py-2 focus:font-semibold"
      >
        Saltar al contenido principal
      </a>

      <Encabezado />

      <Contenedor className="flex-1 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <div className="hidden border-r border-linea lg:block">
          <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-6 pr-4">
            <NavegacionLateral />
          </div>
        </div>

        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="min-w-0 py-5 focus:outline-none sm:py-8"
        >
          <Outlet />
        </main>
      </Contenedor>

      <PieDePagina />
      <ScrollRestoration />
    </div>
  )
}
