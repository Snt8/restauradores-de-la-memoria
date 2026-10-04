import { env } from '@/shared/config/env.js'

/**
 * Los medios propios llegan de la API como rutas relativas («media/museo/2025-altar»);
 * los externos, como URL completas. Este módulo es el único que sabe dónde viven los
 * archivos: si mañana se mueven a un almacenamiento externo, solo cambia aquí.
 */

const ANCHOS = Object.freeze({ sm: 480, lg: 1280 })

export function esMediaPropia(url) {
  return typeof url === 'string' && url.startsWith('media/')
}

/** URL pública de un archivo de `public/` (modelos 3D, medios) respetando la base del sitio. */
export function urlPublica(ruta, base = env.baseUrl) {
  if (/^https?:\/\//.test(ruta)) return ruta
  return `${base.replace(/\/+$/, '')}/${ruta.replace(/^\/+/, '')}`
}

/**
 * Atributos `src` y `srcSet` de una imagen. Las propias tienen dos tamaños (sm y lg)
 * y el navegador elige según el espacio disponible; las externas se usan tal cual.
 */
export function fuentesDeImagen(url, base = env.baseUrl) {
  if (!esMediaPropia(url)) return { src: url }
  const variante = (tamano) => urlPublica(`${url}-${tamano}.webp`, base)
  return {
    src: variante('lg'),
    srcSet: `${variante('sm')} ${ANCHOS.sm}w, ${variante('lg')} ${ANCHOS.lg}w`,
  }
}

/** Versión pequeña de una imagen, para miniaturas donde el srcset no aporta. */
export function miniaturaDeImagen(url, base = env.baseUrl) {
  return esMediaPropia(url) ? urlPublica(`${url}-sm.webp`, base) : url
}
