import { describe, expect, it } from 'vitest'
import { proximaConmemoracion, textoDeDiasRestantes } from './conmemoraciones.js'

const fecha = (slug, mes, dia) => ({ slug, fecha: { anio: null, mes, dia } })

const CALENDARIO = [
  fecha('9-abril', 4, 9),
  fecha('25-mayo', 5, 25),
  fecha('31-agosto', 8, 31),
  { slug: 'sin-fecha', fecha: { anio: null, mes: null, dia: null } },
]

describe('proximaConmemoracion', () => {
  it('elige la siguiente fecha del año', () => {
    const proxima = proximaConmemoracion(CALENDARIO, new Date(2026, 4, 1))

    expect(proxima.conmemoracion.slug).toBe('25-mayo')
    expect(proxima.dias).toBe(24)
  })

  it('cuenta el día mismo como cero días', () => {
    expect(proximaConmemoracion(CALENDARIO, new Date(2026, 3, 9)).dias).toBe(0)
  })

  it('pasada la última del año, salta a la primera del año siguiente', () => {
    const proxima = proximaConmemoracion(CALENDARIO, new Date(2026, 9, 20))

    expect(proxima.conmemoracion.slug).toBe('9-abril')
    expect(proxima.dias).toBe(171)
  })

  it('ignora las fechas sin día y mes', () => {
    expect(proximaConmemoracion([CALENDARIO[3]], new Date(2026, 0, 1))).toBeNull()
  })
})

describe('textoDeDiasRestantes', () => {
  it.each([
    [0, 'Es hoy'],
    [1, 'Es mañana'],
    [12, 'Faltan 12 días'],
  ])('%i días: «%s»', (dias, texto) => {
    expect(textoDeDiasRestantes(dias)).toBe(texto)
  })
})
