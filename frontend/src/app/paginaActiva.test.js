import { describe, expect, it } from 'vitest'
import { PAGINAS, RUTAS } from './navegacion.js'
import { paginaActiva } from './paginaActiva.js'

describe('paginaActiva', () => {
  it.each([
    [RUTAS.inicio, PAGINAS.inicio],
    [RUTAS.museo, PAGINAS.museo],
    [RUTAS.museoVirtual, PAGINAS.museoVirtual],
    [RUTAS.objeto('caja'), PAGINAS.museo],
    [RUTAS.publicacionForo(7), PAGINAS.foro],
    [RUTAS.nuevaPublicacionForo, PAGINAS.foro],
  ])('%s marca «%s»', (ruta, pagina) => {
    expect(paginaActiva(ruta)).toBe(pagina)
  })

  it('no confunde rutas que solo comparten el comienzo ni marca Inicio fuera de la portada', () => {
    expect(paginaActiva('/museografia')).toBeNull()
    expect(paginaActiva('/ruta-que-no-existe')).toBeNull()
  })
})
