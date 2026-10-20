import { Link } from 'react-router'
import { CATEGORIAS_FORO } from '@/content/foro.js'

const PUNTO_POR_TONO = {
  neutro: 'bg-tinta-suave',
  memoria: 'bg-memoria',
  vela: 'bg-vela',
  rosa: 'bg-rosa',
  cielo: 'bg-cielo',
}

const TODAS = { valor: null, etiqueta: 'Todas', tono: 'neutro' }

/**
 * Categorías del foro como píldoras sobre el muro: en móvil una fila que se desliza,
 * en pantallas grandes una fila que se reparte en varias líneas si hace falta.
 *
 * @param enlaceDe  (categoria|null) => URL del muro filtrado, conservando el orden actual
 */
export function CategoriasDelForo({ actual, enlaceDe }) {
  return (
    <nav aria-labelledby="titulo-categorias-foro" className="min-w-0">
      <h2 id="titulo-categorias-foro" className="sr-only">
        Categorías
      </h2>
      <ul className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {[TODAS, ...CATEGORIAS_FORO].map((categoria) => {
          const activa = categoria.valor === actual
          return (
            <li key={categoria.valor ?? 'todas'} className="shrink-0">
              <Link
                to={enlaceDe(categoria.valor)}
                aria-current={activa ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activa
                    ? 'border-memoria bg-memoria text-white'
                    : 'border-tinta/15 bg-white text-tinta-suave hover:border-tinta/40 hover:text-tinta'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full ${PUNTO_POR_TONO[categoria.tono]} ${
                    activa ? 'ring-2 ring-white' : ''
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
