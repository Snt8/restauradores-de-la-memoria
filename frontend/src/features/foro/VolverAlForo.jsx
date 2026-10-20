import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { Icono } from '@/shared/ui/Icono.jsx'

export function VolverAlForo() {
  return (
    <Link
      to={RUTAS.foro}
      className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-semibold text-tinta-suave hover:text-memoria"
    >
      <Icono nombre="flecha-izquierda" className="size-4" />
      Volver al foro
    </Link>
  )
}
