import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { Avatar } from './Avatar.jsx'
import { nombreGuardado } from './identidad.js'
import { CLASE_TARJETA_FORO } from './estilos.js'

/** Barra «Crea una publicación…» sobre el muro, como la de Reddit: lleva al formulario. */
export function AtajoParaPublicar({ categoria }) {
  const destino = categoria
    ? `${RUTAS.nuevaPublicacionForo}?categoria=${categoria}`
    : RUTAS.nuevaPublicacionForo

  return (
    <div className={`${CLASE_TARJETA_FORO} flex items-center gap-3 p-3 sm:p-4`}>
      <Avatar nombre={nombreGuardado() || 'Tú'} />
      <Link
        to={destino}
        className="flex flex-1 items-center justify-between gap-3 rounded-full border border-tinta/15 bg-papel/60 px-4 py-2.5 text-tinta-suave transition-colors hover:border-memoria hover:bg-white"
      >
        <span>Crea una publicación…</span>
        <Icono nombre="mas" className="size-5 text-memoria" />
      </Link>
    </div>
  )
}
