import { describe, expect, it } from 'vitest'
import { armarHilo, contarRespuestas } from './arbol.js'

const comentario = (id, padre_id, puntaje, minuto) => ({
  id,
  padre_id,
  puntaje,
  creado_en: `2026-10-20T12:${String(minuto).padStart(2, '0')}:00Z`,
})

const COMENTARIOS = [
  comentario(1, null, 1, 0),
  comentario(2, null, 5, 1),
  comentario(3, 1, 0, 2),
  comentario(4, 3, 2, 3),
  comentario(5, 1, 3, 4),
]

const ids = (nodos) => nodos.map((n) => [n.id, ids(n.respuestas)])

describe('armarHilo', () => {
  it('anida las respuestas y ordena cada nivel por votos', () => {
    expect(ids(armarHilo(COMENTARIOS))).toEqual([
      [2, []],
      [
        1,
        [
          [5, []],
          [3, [[4, []]]],
        ],
      ],
    ])
  })

  it('puede ordenar por los más recientes', () => {
    expect(armarHilo(COMENTARIOS, 'recientes').map((n) => n.id)).toEqual([2, 1])
  })

  it('a igual puntaje deja primero el más antiguo', () => {
    const hilo = armarHilo([comentario(1, null, 0, 5), comentario(2, null, 0, 1)])

    expect(hilo.map((n) => n.id)).toEqual([2, 1])
  })

  it('no pierde comentarios cuyo padre no está en la lista', () => {
    expect(armarHilo([comentario(9, 77, 0, 0)]).map((n) => n.id)).toEqual([9])
  })

  it('no modifica los comentarios recibidos', () => {
    armarHilo(COMENTARIOS)

    expect(COMENTARIOS[0]).not.toHaveProperty('respuestas')
  })
})

describe('contarRespuestas', () => {
  it('cuenta todos los niveles del hilo', () => {
    const [, primero] = armarHilo(COMENTARIOS)

    expect(contarRespuestas(primero)).toBe(3)
  })
})
