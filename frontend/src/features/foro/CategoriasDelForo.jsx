import { Link } from 'react-router'
import { CATEGORIAS_FORO } from '@/content/foro.js'

const PUNTO_POR_TONO = {
  neutro: 'bg-tinta-suave',
  memoria: 'bg-memoria',
  vela: 'bg-vela',
  rosa: 'bg-rosa',
  cielo: 'bg-cielo',
}

const TODAS = { valor: null, etiqueta: 'Todas las categorías', tono: 'neutro' }

/**
 * Categorías del foro. En móvil, una fila de píldoras que se desliza; desde `lg`,
 * la columna izquierda fija, como la navegación de comunidades de Reddit.
 *
 * @param enlaceDe  (categoria|null) => URL del muro filtrado, conservando el orden actual
 */
export function CategoriasDelForo({ actual, enlaceDe }) {
  return (
    <nav
      aria-labelledby="titulo-categorias-foro"
      className="min-w-0 self-start lg:sticky lg:top-28"
    >
      <h2
        id="titulo-categorias-foro"
        className="sr-only font-sans text-xs font-bold tracking-widest text-tinta-suave uppercase lg:not-sr-only lg:mb-3 lg:block lg:px-3"
      >
        Categorías
      </h2>
      <ul className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {[TODAS, ...CATEGORIAS_FORO].map((categoria) => {
          const activa = categoria.valor === actual
          return (
            <li key={categoria.valor ?? 'todas'} className="shrink-0">
              <Link
                to={enlaceDe(categoria.valor)}
                aria-current={activa ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors lg:rounded-lg lg:border-transparent lg:px-3 lg:py-2.5 ${
                  activa
                    ? 'border-memoria bg-memoria text-white lg:bg-memoria/10 lg:text-memoria-hondo'
                    : 'border-tinta/15 bg-white text-tinta-suave hover:text-tinta lg:bg-transparent lg:hover:bg-tinta/5'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full ${PUNTO_POR_TONO[categoria.tono]} ${
                    activa ? 'ring-2 ring-white lg:ring-0' : ''
                  }`}
                />
                {categoria.etiqueta}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
