import { useEffect, useId, useRef } from 'react'
import { Icono } from './Icono.jsx'

/**
 * Visor modal (lightbox) sobre <dialog>: el navegador ya atrapa el foco, cierra con
 * Escape y devuelve el foco al elemento que lo abrió. Navega con las flechas del teclado.
 *
 * @param abierto     muestra u oculta el visor
 * @param titulo      nombre accesible del diálogo
 * @param posicion    texto como «3 de 12» (opcional)
 * @param onAnterior / onSiguiente  si se omiten, no se muestran los controles
 */
export function Visor({ abierto, titulo, posicion, onCerrar, onAnterior, onSiguiente, children }) {
  const dialogo = useRef(null)
  const idTitulo = useId()

  useEffect(() => {
    const elemento = dialogo.current
    if (abierto && !elemento.open) elemento.showModal()
    if (!abierto && elemento.open) elemento.close()
  }, [abierto])

  function alPresionarTecla(evento) {
    if (evento.key === 'ArrowRight' && onSiguiente) onSiguiente()
    if (evento.key === 'ArrowLeft' && onAnterior) onAnterior()
  }

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      onKeyDown={alPresionarTecla}
      onClick={(evento) => evento.target === dialogo.current && onCerrar()}
      className="m-auto w-[min(64rem,calc(100%-2rem))] rounded-tarjeta bg-noche p-0 text-white backdrop:bg-black/80"
    >
      {abierto && (
        <div className="flex max-h-[90dvh] flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <h2 id={idTitulo} className="font-sans text-base font-semibold">
              {titulo}
            </h2>
            <div className="flex items-center gap-1">
              {posicion && <span className="mr-2 text-sm text-white/70">{posicion}</span>}
              {onAnterior && (
                <BotonVisor etiqueta="Anterior" icono="flecha-izquierda" onClick={onAnterior} />
              )}
              {onSiguiente && (
                <BotonVisor etiqueta="Siguiente" icono="flecha-derecha" onClick={onSiguiente} />
              )}
              <BotonVisor etiqueta="Cerrar" icono="cerrar" onClick={onCerrar} />
            </div>
          </div>
          <div className="overflow-y-auto px-5 pb-5">{children}</div>
        </div>
      )}
    </dialog>
  )
}

function BotonVisor({ etiqueta, icono, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-vela"
    >
      <Icono nombre={icono} />
    </button>
  )
}
