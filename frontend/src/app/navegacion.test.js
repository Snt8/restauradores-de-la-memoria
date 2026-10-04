import { describe, expect, it } from 'vitest'
import { ACCESOS_PRINCIPALES, MENU, PAGINAS, RUTAS } from './navegacion.js'

describe('mapa del sitio', () => {
  it('incluye las diez secciones mínimas que exige el proyecto', () => {
    const rutasDelMenu = MENU.flatMap((entrada) =>
      entrada.paginas ? entrada.paginas.map((p) => p.ruta) : [entrada.ruta],
    )

    expect(rutasDelMenu).toEqual(
      expect.arrayContaining([
        RUTAS.inicio,
        RUTAS.queEs,
        RUTAS.museo,
        RUTAS.salidas,
        RUTAS.fechas,
        RUTAS.eventos,
        RUTAS.reconocimientos,
        RUTAS.alianzas,
        RUTAS.galeria,
        RUTAS.contacto,
      ]),
    )
    expect(rutasDelMenu).toContain(RUTAS.museoVirtual)
  })

  it('no repite rutas en el menú', () => {
    const rutas = MENU.flatMap((e) => (e.paginas ? e.paginas.map((p) => p.ruta) : [e.ruta]))

    expect(new Set(rutas).size).toBe(rutas.length)
  })

  it('cada acceso de inicio tiene nombre y descripción', () => {
    for (const acceso of ACCESOS_PRINCIPALES) {
      expect(acceso.etiqueta).toBeTruthy()
      expect(acceso.descripcion).toBeTruthy()
    }
  })

  it('codifica el slug en la ruta de un objeto', () => {
    expect(RUTAS.objeto('pieza 1')).toBe('/museo/objetos/pieza%201')
    expect(PAGINAS.museo.ruta).toBe('/museo')
  })
})
