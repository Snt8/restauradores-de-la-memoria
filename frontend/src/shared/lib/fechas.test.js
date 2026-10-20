import { describe, expect, it } from 'vitest'
import { fechaParaAtributo, formatearFecha, partesDeCalendario, tiempoRelativo } from './fechas.js'

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

describe('tiempoRelativo', () => {
  const ahora = new Date('2026-10-20T12:00:00Z')
  const antes = (segundos) => new Date(ahora.getTime() - segundos * 1000).toISOString()

  it.each([
    [10, 'hace un momento'],
    [5 * 60, 'hace 5 minutos'],
    [3 * 60 * 60, 'hace 3 horas'],
    [24 * 60 * 60, 'ayer'],
    [3 * 24 * 60 * 60, 'hace 3 días'],
    [14 * 24 * 60 * 60, 'hace 2 semanas'],
    [400 * 24 * 60 * 60, 'el año pasado'],
  ])('%i segundos atrás se lee «%s»', (segundos, esperado) => {
    expect(tiempoRelativo(antes(segundos), ahora)).toBe(esperado)
  })
})
