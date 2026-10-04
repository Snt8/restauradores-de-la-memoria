import { fuentesDeImagen } from '@/shared/api/media.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { presentacionDeEvidencia } from './evidencia.js'

/**
 * Muestra una evidencia completa dentro del visor: la foto en grande, el reproductor
 * de video o audio, o una tarjeta que lleva al sitio original. Siempre con sus créditos.
 */
export function VistaDeEvidencia({ evidencia }) {
  const presentacion = presentacionDeEvidencia(evidencia)

  return (
    <figure>
      <Medio evidencia={evidencia} presentacion={presentacion} />
      <figcaption className="mt-4 space-y-1 text-sm text-white/80">
        {evidencia.descripcion && <p>{evidencia.descripcion}</p>}
        {evidencia.creditos && <p className="text-white/60">Créditos: {evidencia.creditos}</p>}
      </figcaption>
    </figure>
  )
}

function Medio({ evidencia, presentacion }) {
  switch (presentacion.forma) {
    case 'imagen': {
      const { src, srcSet } = fuentesDeImagen(evidencia.url)
      return (
        <img
          src={src}
          srcSet={srcSet}
          sizes="(min-width: 1024px) 60rem, 100vw"
          alt={evidencia.titulo}
          className="mx-auto max-h-[70dvh] w-auto rounded-lg object-contain"
        />
      )
    }
    case 'video':
      return (
        <iframe
          src={presentacion.embebida}
          title={evidencia.titulo}
          className="aspect-video w-full rounded-lg"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      )
    case 'audio':
      return (
        <iframe
          src={presentacion.embebida}
          title={evidencia.titulo}
          className="h-40 w-full rounded-lg"
          allow="autoplay"
          loading="lazy"
        />
      )
    default:
      return (
        <a
          href={evidencia.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 rounded-lg bg-white/10 p-6 hover:bg-white/15"
        >
          <span>
            <span className="block text-lg font-semibold">{evidencia.titulo}</span>
            {presentacion.plataforma && (
              <span className="text-sm text-white/70">Ver en {presentacion.plataforma}</span>
            )}
          </span>
          <Icono nombre="enlace-externo" className="size-6 shrink-0" />
          <span className="sr-only"> (abre en una pestaña nueva)</span>
        </a>
      )
  }
}
