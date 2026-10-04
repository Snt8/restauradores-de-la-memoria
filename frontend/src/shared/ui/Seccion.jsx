import { useId } from 'react'
import { Contenedor } from './Contenedor.jsx'

/** Bloque temático con su título (h2) asociado como nombre accesible de la región. */
export function Seccion({ titulo, descripcion, accion, className = '', children }) {
  const idTitulo = useId()

  return (
    <section aria-labelledby={idTitulo} className={`py-12 sm:py-16 ${className}`}>
      <Contenedor>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id={idTitulo} className="text-3xl font-semibold">
              {titulo}
            </h2>
            {descripcion && <p className="mt-3 text-tinta-suave">{descripcion}</p>}
          </div>
          {accion}
        </div>
        {children}
      </Contenedor>
    </section>
  )
}
