import { esMediaPropia } from '@/shared/api/media.js'
import {
  esSoundcloud,
  miniaturaDeYoutube,
  plataformaDeEnlace,
  urlEmbebidaDeSoundcloud,
  urlEmbebidaDeYoutube,
} from '@/shared/lib/embeds.js'

export const TIPOS_DE_EVIDENCIA = Object.freeze({
  foto: 'Fotografía',
  video: 'Video',
  audio: 'Audio',
  enlace: 'Enlace',
  documento: 'Documento',
})

/**
 * Decide cómo se presenta una evidencia según su tipo y su origen.
 * Centralizarlo evita que cada vista repita las mismas comprobaciones.
 *
 * @returns {{ forma: 'imagen'|'video'|'audio'|'enlace', embebida?: string,
 *             miniatura?: string, plataforma?: string|null }}
 */
export function presentacionDeEvidencia({ tipo, url }) {
  if (tipo === 'foto') return { forma: 'imagen', miniatura: url }

  if (tipo === 'video') {
    const embebida = urlEmbebidaDeYoutube(url)
    if (embebida) return { forma: 'video', embebida, miniatura: miniaturaDeYoutube(url) }
  }

  if (tipo === 'audio' && esSoundcloud(url)) {
    return { forma: 'audio', embebida: urlEmbebidaDeSoundcloud(url) }
  }

  // Videos de redes sociales, publicaciones y documentos: se abren en su sitio original.
  return { forma: 'enlace', plataforma: esMediaPropia(url) ? null : plataformaDeEnlace(url) }
}

/** Primera fotografía de una lista de evidencias: sirve de portada de una tarjeta. */
export function primeraFoto(evidencias = []) {
  return evidencias.find((evidencia) => evidencia.tipo === 'foto') ?? null
}
