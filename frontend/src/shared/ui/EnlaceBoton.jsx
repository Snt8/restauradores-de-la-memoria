import { Link } from 'react-router'
import { Icono } from './Icono.jsx'

const VARIANTES = {
  primario: 'bg-memoria text-white hover:bg-memoria-hondo',
  secundario:
    'border border-tinta/25 bg-white/70 text-tinta hover:border-memoria hover:text-memoria',
  claro: 'bg-vela text-tinta hover:bg-white',
}

const BASE =
  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors'

/**
 * Enlace con aspecto de botón. Si `href` es externo abre una pestaña nueva
 * (avisándolo a lectores de pantalla); si no, navega dentro de la SPA.
 */
export function EnlaceBoton({
  hacia,
  href,
  variante = 'primario',
  icono,
  className = '',
  children,
}) {
  const clases = `${BASE} ${VARIANTES[variante]} ${className}`
  const contenido = (
    <>
      {children}
      {icono && <Icono nombre={icono} className="size-4" />}
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={clases}>
        {contenido}
        <span className="sr-only"> (abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link to={hacia} className={clases}>
      {contenido}
    </Link>
  )
}
