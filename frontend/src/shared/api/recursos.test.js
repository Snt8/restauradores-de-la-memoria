import { describe, expect, it, vi } from 'vitest'
import {
  crearRecurso,
  LIMITE_MAXIMO,
  registrarVisitante,
  siguienteDesplazamiento,
} from './recursos.js'

function clienteFalso(respuesta = {}) {
  return { get: vi.fn().mockResolvedValue(respuesta), post: vi.fn().mockResolvedValue(respuesta) }
}

describe('crearRecurso', () => {
  it('la lista pide todo el contenido con los filtros indicados', async () => {
    const cliente = clienteFalso({ elementos: [] })
    const opciones = crearRecurso('eventos', cliente).lista({ tipo: 'medios' })
    const signal = new AbortController().signal

    await opciones.queryFn({ signal })

    expect(opciones.queryKey).toEqual(['eventos', 'lista', { tipo: 'medios' }])
    expect(cliente.get).toHaveBeenCalledWith('eventos', {
      params: { limite: LIMITE_MAXIMO, tipo: 'medios' },
      signal,
    })
  })

  it('el detalle codifica el slug en la ruta', async () => {
    const cliente = clienteFalso()
    const opciones = crearRecurso('objetos', cliente).detalle('pieza 1')

    await opciones.queryFn({})

    expect(opciones.queryKey).toEqual(['objetos', 'detalle', 'pieza 1'])
    expect(cliente.get.mock.calls[0][0]).toBe('objetos/pieza%201')
  })

  it('la lista infinita pagina con desplazamiento', async () => {
    const cliente = clienteFalso()
    const opciones = crearRecurso('galeria', cliente).listaInfinita({ seccion: 'museo' }, 12)

    await opciones.queryFn({ pageParam: 24 })

    expect(opciones.initialPageParam).toBe(0)
    expect(cliente.get.mock.calls[0][1].params).toEqual({
      seccion: 'museo',
      limite: 12,
      desplazamiento: 24,
    })
  })
})

describe('siguienteDesplazamiento', () => {
  it('avanza mientras queden elementos', () => {
    expect(siguienteDesplazamiento({ total: 30, limite: 12, desplazamiento: 12 })).toBe(24)
  })

  it('se detiene en la última página', () => {
    expect(siguienteDesplazamiento({ total: 30, limite: 12, desplazamiento: 24 })).toBeUndefined()
  })
})

describe('registrarVisitante', () => {
  it('envía los datos por POST a visitantes', async () => {
    const cliente = clienteFalso({ id: 1 })

    await expect(registrarVisitante({ nombre: 'Ana' }, cliente)).resolves.toEqual({ id: 1 })
    expect(cliente.post).toHaveBeenCalledWith('visitantes', { nombre: 'Ana' })
  })
})
