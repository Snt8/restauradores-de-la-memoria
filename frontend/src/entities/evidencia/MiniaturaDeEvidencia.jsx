import { miniaturaDeImagen } from '@/shared/api/media.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { presentacionDeEvidencia, TIPOS_DE_EVIDENCIA } from './evidencia.js'

const ICONO_POR_FORMA = { video: 'reproducir', audio: 'audio', enlace: 'enlace-externo' }

/**
 * Botón cuadrado con la vista previa de una evidencia. Abrirlo nunca carga contenido
 * de terceros: eso ocurre solo dentro del visor.
 */
export function MiniaturaDeEvidencia({ evidencia, onAbrir, detalle }) {
  const presentacion = presentacionDeEvidencia(evidencia)
  const icono = ICONO_POR_FORMA[presentacion.forma]
  const miniatura = presentacion.miniatura ? miniaturaDeImagen(presentacion.miniatura) : null

  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`${TIPOS_DE_EVIDENCIA[evidencia.tipo]}: ${evidencia.titulo}${detalle ? ` (${detalle})` : ''}`}
      className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-noche-suave text-left"
    >
      {miniatura ? (
        <img
          src={miniatura}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="block size-full bg-memoria-hondo p-3 pr-10 text-sm font-semibold text-white/90">
          {presentacion.plataforma ?? TIPOS_DE_EVIDENCIA[evidencia.tipo]}
        </span>
      )}
      {icono && (
        <span className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white">
          <Icono nombre={icono} className="size-4" />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8 text-xs leading-snug text-white">
        {evidencia.titulo}
        {detalle && <span className="block text-white/70">{detalle}</span>}
      </span>
    </button>
  )
}
