import { Outlet, ScrollRestoration } from 'react-router'
import { Encabezado } from './Encabezado.jsx'
import { PieDePagina } from './PieDePagina.jsx'

const MAIN_CONTENT_ID = 'contenido-principal'

/** Estructura base de todas las páginas: encabezado, contenido y pie. */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:rounded-full focus:bg-vela focus:px-4 focus:py-2 focus:font-semibold"
      >
        Saltar al contenido principal
      </a>

      <Encabezado />

      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      <PieDePagina />
      <ScrollRestoration />
    </div>
  )
}
