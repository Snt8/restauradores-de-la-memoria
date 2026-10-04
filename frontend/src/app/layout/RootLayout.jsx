import { Link, Outlet } from 'react-router'

const MAIN_CONTENT_ID = 'contenido-principal'

/** Estructura base de todas las páginas: encabezado, contenido y pie. */
export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Saltar al contenido principal
      </a>

      <header className="border-b px-4 py-4">
        <Link to="/" className="font-semibold">
          Restauradores de la Memoria
        </Link>
      </header>

      <main id={MAIN_CONTENT_ID} className="flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t px-4 py-4 text-sm">Colegio Tom Adams IED</footer>
    </div>
  )
}
