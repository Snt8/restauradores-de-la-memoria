import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { BotonCompartir } from './BotonCompartir.jsx'
import { ControlDeVoto } from './ControlDeVoto.jsx'
import { CLASE_ACCION, CLASE_TARJETA_FORO, textoDeComentarios } from './estilos.js'
import { MetadatosDePublicacion } from './MetadatosDePublicacion.jsx'
import { useVoto } from './useVoto.js'

/**
 * Publicación en el muro, al estilo de Reddit: votos a la izquierda (abajo en móvil),
 * contexto, título, un extracto y las acciones. Toda la tarjeta lleva a la publicación;
 * los controles internos quedan por encima del enlace para seguir siendo clicables.
 */
export function TarjetaDePublicacion({ publicacion, nivelDeTitulo = 3 }) {
  const Titulo = `h${nivelDeTitulo}`
  const ruta = RUTAS.publicacionForo(publicacion.id)
  const voto = useVoto({
    objetivo: 'publicacion',
    id: publicacion.id,
    puntaje: publicacion.puntaje,
    miVoto: publicacion.mi_voto,
  })

  return (
    <article
      className={`${CLASE_TARJETA_FORO} relative flex transition hover:border-tinta/30 hover:shadow-tarjeta`}
    >
      <div className="hidden w-14 shrink-0 justify-center rounded-l-tarjeta bg-papel/70 py-4 sm:flex">
        <ControlDeVoto voto={voto} titulo={publicacion.titulo} />
      </div>

      <div className="min-w-0 flex-1 px-5 pt-5 pb-3 sm:px-6 sm:pt-5">
        <MetadatosDePublicacion publicacion={publicacion} />
        <Titulo className="mt-3 font-sans text-lg leading-snug font-semibold text-pretty sm:text-xl">
          <Link
            to={ruta}
            className="after:absolute after:inset-0 after:rounded-tarjeta hover:text-memoria"
          >
            {publicacion.titulo}
          </Link>
        </Titulo>
        <p className="mt-2 line-clamp-3 leading-relaxed whitespace-pre-line text-tinta-suave">
          {publicacion.contenido}
        </p>

        <div className="mt-3 -ml-2 flex flex-wrap items-center gap-1">
          <div className="sm:hidden">
            <ControlDeVoto voto={voto} orientacion="horizontal" titulo={publicacion.titulo} />
          </div>
          <Link to={`${ruta}#comentarios`} className={CLASE_ACCION}>
            <Icono nombre="comentario" className="size-4" />
            {textoDeComentarios(publicacion.comentarios)}
          </Link>
          <BotonCompartir ruta={ruta} titulo={publicacion.titulo} />
        </div>
      </div>
    </article>
  )
}
