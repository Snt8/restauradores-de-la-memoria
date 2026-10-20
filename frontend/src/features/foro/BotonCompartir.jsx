import { useState } from 'react'
import { Icono } from '@/shared/ui/Icono.jsx'
import { CLASE_ACCION } from './estilos.js'

/**
 * Comparte el enlace de una publicación: con el menú nativo del dispositivo si existe
 * (móviles) o copiándolo al portapapeles, y lo confirma en voz alta y en pantalla.
 */
export function BotonCompartir({ ruta, titulo }) {
  const [copiado, setCopiado] = useState(false)

  async function compartir() {
    const url = new URL(ruta, window.location.origin).href
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Cancelar el menú de compartir no es un error que haya que mostrar.
    }
  }

  return (
    <button type="button" onClick={compartir} className={CLASE_ACCION}>
      <Icono nombre="compartir" className="size-4" />
      <span aria-live="polite">{copiado ? '¡Enlace copiado!' : 'Compartir'}</span>
    </button>
  )
}
