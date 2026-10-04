import { describe, expect, it } from 'vitest'
import { fechaParaAtributo, formatearFecha, partesDeCalendario } from './fechas.js'

describe('formatearFecha', () => {
  it.each([
    [{ anio: 2025, mes: 10, dia: 22 }, '22 de octubre de 2025'],
    [{ anio: 2023, mes: 10, dia: null }, 'octubre de 2023'],
    [{ anio: 2022, mes: null, dia: null }, '2022'],
    [{ anio: null, mes: 4, dia: 9 }, '9 de abril'],
    [{ anio: null, mes: null, dia: null }, null],
    [undefined, null],
  ])('muestra %o con la precisión que tiene: %s', (fecha, esperado) => {
    expect(formatearFecha(fecha)).toBe(esperado)
  })
})

describe('fechaParaAtributo', () => {
  it.each([
    [{ anio: 2025, mes: 6, dia: 5 }, '2025-06-05'],
    [{ anio: 2024, mes: 3 }, '2024-03'],
    [{ anio: 2018 }, '2018'],
    [{ mes: 2, dia: 12 }, '--02-12'],
    [{}, null],
  ])('convierte %o en %s', (fecha, esperado) => {
    expect(fechaParaAtributo(fecha)).toBe(esperado)
  })
})

describe('partesDeCalendario', () => {
  it('separa día y mes para la hoja de calendario', () => {
    expect(partesDeCalendario({ mes: 8, dia: 31 })).toEqual({ dia: '31', mes: 'agosto' })
  })

  it('devuelve null si falta el día o el mes', () => {
    expect(partesDeCalendario({ anio: 2024, mes: 8 })).toBeNull()
  })
})
