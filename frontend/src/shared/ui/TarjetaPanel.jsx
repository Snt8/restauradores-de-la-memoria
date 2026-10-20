import { useId } from 'react'
import { CLASE_TARJETA } from './estilos.js'

/**
 * Tarjeta de la columna derecha («Acerca del foro», «En esta página»…).
 *
 * @param destacada  agrega la franja con los colores del proyecto
 * @param fija           se queda visible al desplazarse (cuando el panel es columna)
 * @param soloEnColumna  se oculta por debajo de `xl`, donde el panel queda al final de la
 *                       página (p. ej. un índice, que ahí ya no sirve)
 */
export function TarjetaPanel({
  titulo,
  destacada = false,
  fija = false,
  soloEnColumna = false,
  children,
}) {
  const idTitulo = useId()

  return (
    <section
      aria-labelledby={idTitulo}
      className={`${CLASE_TARJETA} overflow-hidden ${fija ? 'xl:sticky xl:top-24' : ''} ${
        soloEnColumna ? 'hidden xl:block' : ''
      }`}
    >
      {destacada && (
        <div aria-hidden="true" className="h-2 bg-gradient-to-r from-memoria via-vela to-rosa" />
      )}
      <div className="space-y-4 p-6">
        <h2 id={idTitulo} className="font-sans text-base font-bold">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  )
}
