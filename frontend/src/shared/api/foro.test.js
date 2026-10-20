import { describe, expect, it, vi } from 'vitest'
import { crearApiForo } from './foro.js'

function clienteFalso(respuesta = {}) {
  return {
    get: vi.fn().mockResolvedValue(respuesta),
    post: vi.fn().mockResolvedValue(respuesta),
    put: vi.fn().mockResolvedValue(respuesta),
  }
}

describe('crearApiForo', () => {
  it('pagina el muro con categoría, orden y votante', async () => {
    const cliente = clienteFalso()
    const opciones = crearApiForo(cliente).publicaciones({
      categoria: 'museo',
      orden: 'recientes',
      votante: 'v-1',
      porPagina: 10,
    })

    await opciones.queryFn({ pageParam: 20 })

    expect(opciones.queryKey).toEqual([
      'foro',
      'publicaciones',
      { categoria: 'museo', orden: 'recientes', porPagina: 10 },
    ])
    expect(cliente.get).toHaveBeenCalledWith('foro/publicaciones', {
      params: {
        categoria: 'museo',
        orden: 'recientes',
        votante: 'v-1',
        limite: 10,
        desplazamiento: 20,
      },
      signal: undefined,
    })
    expect(opciones.getNextPageParam({ total: 25, limite: 10, desplazamiento: 10 })).toBe(20)
  })

  it('consulta una publicación y sus comentarios con el voto propio', async () => {
    const cliente = clienteFalso()
    const api = crearApiForo(cliente)

    await api.publicacion(7, 'v-1').queryFn({})
    await api.comentarios(7, 'v-1').queryFn({})

    expect(cliente.get.mock.calls.map(([ruta, { params }]) => [ruta, params])).toEqual([
      ['foro/publicaciones/7', { votante: 'v-1' }],
      ['foro/publicaciones/7/comentarios', { votante: 'v-1' }],
    ])
    expect(api.comentarios(7).queryKey).toEqual(['foro', 'comentarios', '7'])
  })

  it('publica, comenta y vota en la ruta de cada objetivo', async () => {
    const cliente = clienteFalso()
    const api = crearApiForo(cliente)

    await api.publicar({ titulo: 'Hola' })
    await api.comentar(3, { contenido: 'Bien' })
    await api.votar({ objetivo: 'comentario', id: 9, votante: 'v-1', valor: -1 })

    expect(cliente.post.mock.calls).toEqual([
      ['foro/publicaciones', { titulo: 'Hola' }],
      ['foro/publicaciones/3/comentarios', { contenido: 'Bien' }],
    ])
    expect(cliente.put).toHaveBeenCalledWith('foro/comentarios/9/voto', {
      votante: 'v-1',
      valor: -1,
    })
  })
})
