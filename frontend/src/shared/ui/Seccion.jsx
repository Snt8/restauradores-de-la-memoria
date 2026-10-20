import { useId } from 'react'
import { Contenedor } from './Contenedor.jsx'

/** Bloque temático con su título (h2) asociado como nombre accesible de la región. */
export function Seccion({ titulo, descripcion, accion, className = '', children }) {
  const idTitulo = useId()

  return (
    <section aria-labelledby={idTitulo} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <Contenedor>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 sm:mb-12">
          <div className="max-w-2xl">
            <h2 id={idTitulo} className="text-3xl font-semibold sm:text-4xl">
              {titulo}
            </h2>
            {descripcion && <p className="mt-4 text-lg text-tinta-suave">{descripcion}</p>}
          </div>
          {accion}
        </div>
        {children}
      </Contenedor>
    </section>
  )
}
