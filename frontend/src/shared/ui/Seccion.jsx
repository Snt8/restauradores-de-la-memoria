import { useId } from 'react'
import { CLASE_TARJETA } from './estilos.js'

const VARIANTES = {
  // Texto y datos sueltos: la sección es una tarjeta.
  tarjeta: `${CLASE_TARJETA} p-6 sm:p-8`,
  // Listas de tarjetas (publicaciones, eventos…): solo el título, sin tarjeta alrededor.
  abierta: '',
}

/**
 * Bloque temático de la columna central con su título (h2) como nombre accesible.
 * `id` permite enlazarlo desde el índice «En esta página».
 */
export function Seccion({
  id,
  titulo,
  descripcion,
  accion,
  variante = 'tarjeta',
  className = '',
  children,
}) {
  const idTitulo = useId()
  const abierta = variante === 'abierta'

  return (
    <section
      id={id}
      aria-labelledby={idTitulo}
      className={`scroll-mt-24 ${VARIANTES[variante]} ${className}`}
    >
      <div
        className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${
          abierta ? 'mb-4 px-1' : 'mb-6'
        }`}
      >
        <div className="max-w-2xl">
          <h2 id={idTitulo} className="text-2xl font-semibold sm:text-3xl">
            {titulo}
          </h2>
          {descripcion && <p className="mt-2 text-tinta-suave">{descripcion}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}
