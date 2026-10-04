import { describe, expect, it } from 'vitest'
import { esMediaPropia, fuentesDeImagen, miniaturaDeImagen, urlPublica } from './media.js'

describe('medios', () => {
  it('distingue los medios propios de los externos', () => {
    expect(esMediaPropia('media/museo/2025-danza')).toBe(true)
    expect(esMediaPropia('https://i.ytimg.com/vi/x/hqdefault.jpg')).toBe(false)
    expect(esMediaPropia(null)).toBe(false)
  })

  it('arma src y srcSet con los dos tamaños publicados', () => {
    expect(fuentesDeImagen('media/museo/2025-danza', '/')).toEqual({
      src: '/media/museo/2025-danza-lg.webp',
      srcSet: '/media/museo/2025-danza-sm.webp 480w, /media/museo/2025-danza-lg.webp 1280w',
    })
  })

  it('usa las imágenes externas sin transformarlas', () => {
    expect(fuentesDeImagen('https://example.com/a.jpg')).toEqual({
      src: 'https://example.com/a.jpg',
    })
  })

  it('respeta la base del sitio cuando se publica en un subdirectorio', () => {
    expect(urlPublica('models/pieza.glb', '/portal/')).toBe('/portal/models/pieza.glb')
    expect(miniaturaDeImagen('media/a', '/portal')).toBe('/portal/media/a-sm.webp')
    expect(urlPublica('https://cdn.example.com/x.glb', '/portal/')).toBe(
      'https://cdn.example.com/x.glb',
    )
  })
})
