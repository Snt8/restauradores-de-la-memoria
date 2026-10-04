import { describe, expect, it } from 'vitest'
import { presentacionDeEvidencia, primeraFoto } from './evidencia.js'

describe('presentacionDeEvidencia', () => {
  it('muestra las fotos como imagen', () => {
    expect(presentacionDeEvidencia({ tipo: 'foto', url: 'media/a' })).toEqual({
      forma: 'imagen',
      miniatura: 'media/a',
    })
  })

  it('incrusta los videos de YouTube con miniatura', () => {
    const presentacion = presentacionDeEvidencia({
      tipo: 'video',
      url: 'https://www.youtube.com/watch?v=7KZMLHnJLM8',
    })

    expect(presentacion.forma).toBe('video')
    expect(presentacion.embebida).toBe('https://www.youtube-nocookie.com/embed/7KZMLHnJLM8')
    expect(presentacion.miniatura).toContain('7KZMLHnJLM8')
  })

  it('incrusta los audios de SoundCloud', () => {
    const presentacion = presentacionDeEvidencia({
      tipo: 'audio',
      url: 'https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo',
    })

    expect(presentacion.forma).toBe('audio')
    expect(presentacion.embebida).toMatch(/^https:\/\/w\.soundcloud\.com\/player\//)
  })

  it('enlaza al sitio original los videos de redes y los enlaces', () => {
    expect(
      presentacionDeEvidencia({ tipo: 'video', url: 'https://web.facebook.com/reel/1' }),
    ).toEqual({ forma: 'enlace', plataforma: 'Facebook' })
    expect(
      presentacionDeEvidencia({ tipo: 'enlace', url: 'https://www.instagram.com/p/x/' }),
    ).toEqual({ forma: 'enlace', plataforma: 'Instagram' })
  })
})

describe('primeraFoto', () => {
  it('elige la primera fotografía e ignora videos y enlaces', () => {
    const foto = { tipo: 'foto', url: 'media/b' }

    expect(primeraFoto([{ tipo: 'video', url: 'x' }, foto, { tipo: 'foto', url: 'c' }])).toBe(foto)
    expect(primeraFoto([])).toBeNull()
    expect(primeraFoto()).toBeNull()
  })
})
