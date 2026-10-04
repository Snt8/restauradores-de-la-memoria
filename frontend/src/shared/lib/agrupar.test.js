import { describe, expect, it } from 'vitest'
import { agruparPor } from './agrupar.js'

describe('agruparPor', () => {
  it('agrupa conservando el orden de aparición de cada grupo', () => {
    const salidas = [
      { nombre: 'A', anio: 2025 },
      { nombre: 'B', anio: 2023 },
      { nombre: 'C', anio: 2025 },
      { nombre: 'D', anio: null },
    ]

    expect(agruparPor(salidas, (s) => s.anio)).toEqual([
      [2025, [salidas[0], salidas[2]]],
      [2023, [salidas[1]]],
      [null, [salidas[3]]],
    ])
  })

  it('devuelve una lista vacía para una entrada vacía', () => {
    expect(agruparPor([], () => 'x')).toEqual([])
  })
})
