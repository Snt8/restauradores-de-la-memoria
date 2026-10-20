import { useInfiniteQuery } from '@tanstack/react-query'
import { RUTAS } from '@/app/navegacion.js'
import { foro } from '@/shared/api/foro.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { idDeVotante } from './identidad.js'
import { CLASE_TARJETA_FORO } from './estilos.js'
import { TarjetaDePublicacion } from './TarjetaDePublicacion.jsx'

const POR_PAGINA = 20

/** Publicaciones de una categoría (o de todas) en el orden elegido, con carga progresiva. */
export function MuroDelForo({ categoria, orden }) {
  const consulta = useInfiniteQuery(
    foro.publicaciones({ categoria, orden, votante: idDeVotante(), porPagina: POR_PAGINA }),
  )

  return (
    <EstadoDeConsulta consulta={consulta} esVacio={() => false} cargando={<EsqueletoDelMuro />}>
      {(datos) => {
        const publicaciones = datos.pages.flatMap((pagina) => pagina.elementos)
        if (publicaciones.length === 0) return <MuroVacio categoria={categoria} />
        return (
          <div className="space-y-6">
            <ol className="space-y-4 sm:space-y-5">
              {publicaciones.map((publicacion) => (
                <li key={publicacion.id}>
                  <TarjetaDePublicacion publicacion={publicacion} />
                </li>
              ))}
            </ol>
            {consulta.hasNextPage && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => consulta.fetchNextPage()}
                  disabled={consulta.isFetchingNextPage}
                  className="rounded-full border border-tinta/20 bg-white px-6 py-2.5 text-sm font-semibold hover:border-memoria hover:text-memoria disabled:opacity-60"
                >
                  {consulta.isFetchingNextPage ? 'Cargando…' : 'Ver más publicaciones'}
                </button>
              </div>
            )}
          </div>
        )
      }}
    </EstadoDeConsulta>
  )
}

function MuroVacio({ categoria }) {
  const destino = categoria
    ? `${RUTAS.nuevaPublicacionForo}?categoria=${categoria}`
    : RUTAS.nuevaPublicacionForo
  return (
    <div className={`${CLASE_TARJETA_FORO} px-6 py-14 text-center sm:px-10`}>
      <p className="font-display text-2xl font-semibold">Todavía no hay conversaciones aquí</p>
      <p className="mx-auto mt-3 max-w-md text-tinta-suave">
        Abre la primera: haz una pregunta, comparte un recuerdo o cuéntanos qué te dejó una salida
        pedagógica.
      </p>
      <EnlaceBoton hacia={destino} icono="mas" className="mt-6">
        Crear publicación
      </EnlaceBoton>
    </div>
  )
}

function EsqueletoDelMuro() {
  return (
    <div role="status" aria-live="polite" className="space-y-4 sm:space-y-5">
      <span className="sr-only">Cargando publicaciones…</span>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} aria-hidden="true" className={`${CLASE_TARJETA_FORO} animate-pulse p-6`}>
          <div className="h-3 w-1/3 rounded bg-papel-hondo" />
          <div className="mt-4 h-5 w-3/4 rounded bg-papel-hondo" />
          <div className="mt-3 h-3 w-full rounded bg-papel-hondo" />
          <div className="mt-2 h-3 w-5/6 rounded bg-papel-hondo" />
        </div>
      ))}
    </div>
  )
}
