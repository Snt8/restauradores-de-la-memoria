import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { apiClient } from './apiClient.js'
import { siguienteDesplazamiento } from './recursos.js'

const RAIZ = 'foro'
const RUTA_DE_OBJETIVO = Object.freeze({ publicacion: 'publicaciones', comentario: 'comentarios' })

/**
 * API del foro. A diferencia del contenido institucional, el foro también escribe
 * (publicar, comentar, votar), así que vive en su propio módulo con sus claves de caché.
 * `votante` es el id anónimo del navegador: la API lo usa para devolver el voto propio.
 */
export function crearApiForo(cliente = apiClient) {
  const publicacion = (id) => `foro/publicaciones/${encodeURIComponent(id)}`

  return Object.freeze({
    raiz: [RAIZ],

    publicaciones: ({ categoria = null, orden = null, votante, porPagina = 20 }) =>
      infiniteQueryOptions({
        queryKey: [RAIZ, 'publicaciones', { categoria, orden, porPagina }],
        initialPageParam: 0,
        queryFn: ({ pageParam, signal }) =>
          cliente.get('foro/publicaciones', {
            params: { categoria, orden, votante, limite: porPagina, desplazamiento: pageParam },
            signal,
          }),
        getNextPageParam: siguienteDesplazamiento,
      }),

    destacadas: ({ limite = 3 } = {}) =>
      queryOptions({
        queryKey: [RAIZ, 'destacadas', limite],
        queryFn: ({ signal }) =>
          cliente.get('foro/publicaciones', { params: { orden: 'populares', limite }, signal }),
      }),

    publicacion: (id, votante) =>
      queryOptions({
        queryKey: [RAIZ, 'publicacion', String(id)],
        queryFn: ({ signal }) => cliente.get(publicacion(id), { params: { votante }, signal }),
      }),

    comentarios: (id, votante) =>
      queryOptions({
        queryKey: [RAIZ, 'comentarios', String(id)],
        queryFn: ({ signal }) =>
          cliente.get(`${publicacion(id)}/comentarios`, { params: { votante }, signal }),
      }),

    publicar: (datos) => cliente.post('foro/publicaciones', datos),

    comentar: (id, datos) => cliente.post(`${publicacion(id)}/comentarios`, datos),

    votar: ({ objetivo, id, votante, valor }) =>
      cliente.put(`foro/${RUTA_DE_OBJETIVO[objetivo]}/${encodeURIComponent(id)}/voto`, {
        votante,
        valor,
      }),
  })
}

export const foro = crearApiForo()
