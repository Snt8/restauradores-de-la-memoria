import { describe, expect, it } from 'vitest'
import { evidencia, exposicion, objeto } from '@/test/fixtures.js'
import {
  anguloHacia,
  distribuirCuadros,
  LIMITES,
  limitarPosicion,
  lugaresEnMuros,
  paradasDelRecorrido,
  rotacionTrasArrastre,
  seleccionarFotos,
  tamanoDeCuadro,
  vec3,
} from './sala.js'

describe('limitarPosicion', () => {
  it('deja intacta una posición dentro de la sala', () => {
    expect(limitarPosicion({ x: 1, z: -3 })).toEqual({ x: 1, z: -3 })
  })

  it('detiene al visitante antes de los muros', () => {
    expect(limitarPosicion({ x: 50, z: -99 })).toEqual({ x: LIMITES.maxX, z: LIMITES.minZ })
    expect(limitarPosicion({ x: -50, z: 99 })).toEqual({ x: LIMITES.minX, z: LIMITES.maxZ })
  })
})

describe('anguloHacia', () => {
  it('mira hacia -Z con 0 grados y hacia la izquierda con 90', () => {
    expect(anguloHacia({ x: 0, z: 0 }, { x: 0, z: -5 })).toBe(0)
    expect(anguloHacia({ x: 0, z: 0 }, { x: -5, z: 0 })).toBe(90)
  })
})

describe('paradasDelRecorrido', () => {
  it('crea una parada por objeto, en orden, frente a cada pedestal', () => {
    const paradas = paradasDelRecorrido([
      objeto({ slug: 'vasija', orden: 2, ubicacion: { x: 2.2, y: 1, z: -5 } }),
      objeto({ slug: 'caja', orden: 1, ubicacion: { x: -2.2, y: 1, z: -5 } }),
    ])

    expect(paradas.map((p) => p.slug)).toEqual(['caja', 'vasija'])
    const [caja] = paradas
    expect(caja.posicion.z).toBeCloseTo(-2.8)
    expect(caja.posicion.x).toBeGreaterThan(-2.2) // un paso hacia el centro de la sala
    expect(Math.abs(caja.rotacionY)).toBeLessThan(20) // mirando casi de frente al objeto
  })

  it('nunca ubica al visitante fuera de la sala', () => {
    const [parada] = paradasDelRecorrido([objeto({ ubicacion: { x: 0, y: 1, z: 1.8 } })])

    expect(parada.posicion.z).toBeLessThanOrEqual(LIMITES.maxZ)
  })
})

describe('cuadros en los muros', () => {
  it('ofrece lugares en ambos muros laterales y en el fondo, mirando hacia la sala', () => {
    const lugares = lugaresEnMuros({ porMuroLateral: 2, enFondo: 3 })

    expect(lugares).toHaveLength(7)
    expect(new Set(lugares.map((l) => l.rotacionY))).toEqual(new Set([90, -90, 0]))
  })

  it('alterna entre exposiciones para que todas tengan presencia', () => {
    const fotos = (nombre, n) =>
      Array.from({ length: n }, (_, i) => evidencia({ titulo: `${nombre} ${i}` }))
    const exposiciones = [
      exposicion({ nombre: '2026', evidencias: fotos('2026', 3) }),
      exposicion({
        nombre: '2025',
        evidencias: [evidencia({ tipo: 'video' }), ...fotos('2025', 1)],
      }),
    ]

    const elegidas = seleccionarFotos(exposiciones, 4)

    expect(elegidas.map((f) => f.evidencia.titulo)).toEqual([
      '2026 0',
      '2025 0',
      '2026 1',
      '2026 2',
    ])
  })

  it('distribuye tantas fotos como lugares haya', () => {
    const exposiciones = [exposicion({ evidencias: [evidencia(), evidencia(), evidencia()] })]

    const cuadros = distribuirCuadros(
      exposiciones,
      lugaresEnMuros({ porMuroLateral: 1, enFondo: 0 }),
    )

    expect(cuadros).toHaveLength(2)
    expect(cuadros[0]).toMatchObject({ rotacionY: 90, exposicion: exposiciones[0].nombre })
  })
})

describe('tamanoDeCuadro', () => {
  it('respeta la proporción de la foto dentro de los máximos', () => {
    expect(tamanoDeCuadro(1.5)).toEqual({ ancho: 1.9, alto: 1.267 })
    expect(tamanoDeCuadro(0.75)).toEqual({ ancho: 1.125, alto: 1.5 })
  })

  it('usa una proporción segura si no se conoce', () => {
    expect(tamanoDeCuadro(Number.NaN)).toEqual(tamanoDeCuadro(1.5))
  })
})

describe('utilidades', () => {
  it('gira el modelo según el arrastre', () => {
    expect(rotacionTrasArrastre(10, 100)).toBe(50)
    expect(rotacionTrasArrastre(350, 50)).toBe(10)
  })

  it('formatea vectores para A-Frame', () => {
    expect(vec3({ x: 1, y: 1.6, z: -2.33333 })).toBe('1 1.6 -2.333')
  })
})
