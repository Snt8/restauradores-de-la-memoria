import { describe, expect, it } from 'vitest'
import {
  idDeYoutube,
  miniaturaDeYoutube,
  plataformaDeEnlace,
  urlEmbebidaDeSoundcloud,
  urlEmbebidaDeYoutube,
} from './embeds.js'

describe('YouTube', () => {
  it.each([
    'https://www.youtube.com/watch?v=-O6inKLKRRI',
    'https://www.youtube.com/watch?feature=share&v=-O6inKLKRRI',
    'https://youtu.be/-O6inKLKRRI',
    'https://www.youtube.com/embed/-O6inKLKRRI',
  ])('reconoce el id del video en %s', (url) => {
    expect(idDeYoutube(url)).toBe('-O6inKLKRRI')
  })

  it('usa el dominio sin cookies para el reproductor', () => {
    expect(urlEmbebidaDeYoutube('https://youtu.be/EvR31L2aH44')).toBe(
      'https://www.youtube-nocookie.com/embed/EvR31L2aH44',
    )
    expect(miniaturaDeYoutube('https://youtu.be/EvR31L2aH44')).toBe(
      'https://i.ytimg.com/vi/EvR31L2aH44/hqdefault.jpg',
    )
  })

  it('devuelve null para enlaces que no son de YouTube', () => {
    expect(urlEmbebidaDeYoutube('https://web.facebook.com/reel/1')).toBeNull()
    expect(idDeYoutube(undefined)).toBeNull()
  })
})

describe('SoundCloud', () => {
  it('arma el reproductor con la URL codificada', () => {
    const url = 'https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo'

    const embebida = new URL(urlEmbebidaDeSoundcloud(url))

    expect(embebida.origin).toBe('https://w.soundcloud.com')
    expect(embebida.searchParams.get('url')).toBe(url)
  })

  it('ignora URLs de otros sitios', () => {
    expect(urlEmbebidaDeSoundcloud('https://example.com/audio')).toBeNull()
  })
})

describe('plataformaDeEnlace', () => {
  it.each([
    ['https://www.instagram.com/p/DQMuGmsjtRB/', 'Instagram'],
    ['https://web.facebook.com/reel/1748586202702527', 'Facebook'],
    ['https://x.com/Bogota/status/1', 'X'],
    ['https://youtu.be/abc', 'YouTube'],
    ['https://infomatrix.lat/colombia/', 'infomatrix.lat'],
    ['no es una url', null],
  ])('%s → %s', (url, esperado) => {
    expect(plataformaDeEnlace(url)).toBe(esperado)
  })
})
