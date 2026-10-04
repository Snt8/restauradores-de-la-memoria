import { fuentesDeImagen } from '@/shared/api/media.js'

/**
 * Imagen con srcset para medios propios, carga diferida y decodificación asíncrona.
 * `sizes` le dice al navegador qué ancho ocupará, para que descargue la versión justa.
 */
export function ImagenResponsiva({
  url,
  alt,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  carga = 'lazy',
  className = '',
}) {
  const { src, srcSet } = fuentesDeImagen(url)

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={carga}
      decoding="async"
      fetchPriority={carga === 'eager' ? 'high' : undefined}
      className={className}
    />
  )
}
