/**
 * Utilidades para contenido de terceros (YouTube, SoundCloud y redes sociales).
 * Los reproductores se cargan solo cuando el visitante los abre: así el portal
 * no descarga scripts ajenos ni comparte datos de navegación sin que haga falta.
 */

const PATRONES_YOUTUBE = [
  /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /youtube\.com\/(?:embed|shorts)\/([\w-]{11})/,
]

export function idDeYoutube(url) {
  for (const patron of PATRONES_YOUTUBE) {
    const coincidencia = patron.exec(url ?? '')
    if (coincidencia) return coincidencia[1]
  }
  return null
}

/** Versión sin cookies de YouTube: no rastrea al visitante hasta que reproduce. */
export function urlEmbebidaDeYoutube(url) {
  const id = idDeYoutube(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function miniaturaDeYoutube(url) {
  const id = idDeYoutube(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export function esSoundcloud(url) {
  return /^https:\/\/(?:www\.)?soundcloud\.com\//.test(url ?? '')
}

export function urlEmbebidaDeSoundcloud(url) {
  if (!esSoundcloud(url)) return null
  const parametros = new URLSearchParams({ url, color: '#176b6b', visual: 'false' })
  return `https://w.soundcloud.com/player/?${parametros}`
}

const PLATAFORMAS = [
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'],
  [/(^|\.)soundcloud\.com$/, 'SoundCloud'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)facebook\.com$/, 'Facebook'],
  [/^(x|twitter)\.com$/, 'X'],
]

/** Nombre legible del sitio al que lleva un enlace: «YouTube», «Instagram» o el dominio. */
export function plataformaDeEnlace(url) {
  let dominio
  try {
    dominio = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
  const conocida = PLATAFORMAS.find(([patron]) => patron.test(dominio))
  return conocida ? conocida[1] : dominio
}
