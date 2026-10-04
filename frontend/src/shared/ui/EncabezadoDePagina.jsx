import { Contenedor } from './Contenedor.jsx'

const NOMBRE_DEL_SITIO = 'Restauradores de la Memoria'

/**
 * Encabezado de cada sección: título visible (h1), entradilla y título de la pestaña.
 * React 19 lleva el <title> al <head> del documento.
 */
export function EncabezadoDePagina({ titulo, antetitulo, entradilla, children }) {
  return (
    <div className="border-b border-linea bg-papel-hondo">
      <title>{`${titulo} · ${NOMBRE_DEL_SITIO}`}</title>
      <Contenedor className="py-12 sm:py-16">
        {antetitulo && (
          <p className="mb-3 text-sm font-semibold tracking-widest text-memoria uppercase">
            {antetitulo}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">{titulo}</h1>
        {entradilla && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-tinta-suave">{entradilla}</p>
        )}
        {children}
      </Contenedor>
    </div>
  )
}
