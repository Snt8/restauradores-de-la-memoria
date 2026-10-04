import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { apiClient } from './apiClient.js'

/** La API pagina hasta 100 elementos: las secciones piden todo su contenido de una vez. */
export const LIMITE_MAXIMO = 100

/** Desplazamiento de la página siguiente, o undefined si ya no hay más. */
export function siguienteDesplazamiento({ total, limite, desplazamiento }) {
  const siguiente = desplazamiento + limite
  return siguiente < total ? siguiente : undefined
}

/**
 * Describe una colección de la API como opciones de TanStack Query.
 * Todas las colecciones se consultan igual, así que ninguna feature repite
 * claves de caché, rutas ni lógica de paginación.
 */
export function crearRecurso(ruta, cliente = apiClient) {
  return Object.freeze({
    raiz: [ruta],

    lista: (filtros = {}) =>
      queryOptions({
        queryKey: [ruta, 'lista', filtros],
        queryFn: ({ signal }) =>
          cliente.get(ruta, { params: { limite: LIMITE_MAXIMO, ...filtros }, signal }),
      }),

    detalle: (slug) =>
      queryOptions({
        queryKey: [ruta, 'detalle', slug],
        queryFn: ({ signal }) => cliente.get(`${ruta}/${encodeURIComponent(slug)}`, { signal }),
      }),

    listaInfinita: (filtros = {}, porPagina = 24) =>
      infiniteQueryOptions({
        queryKey: [ruta, 'infinita', filtros, porPagina],
        initialPageParam: 0,
        queryFn: ({ pageParam, signal }) =>
          cliente.get(ruta, {
            params: { ...filtros, limite: porPagina, desplazamiento: pageParam },
            signal,
          }),
        getNextPageParam: siguienteDesplazamiento,
      }),
  })
}

export const recursos = Object.freeze({
  exposiciones: crearRecurso('exposiciones'),
  objetos: crearRecurso('objetos'),
  eventos: crearRecurso('eventos'),
  actividades: crearRecurso('actividades'),
  reconocimientos: crearRecurso('reconocimientos'),
  aliados: crearRecurso('aliados'),
  galeria: crearRecurso('galeria'),
})

/** Envía el formulario de contacto o la firma del libro de visitas. */
export function registrarVisitante(datos, cliente = apiClient) {
  return cliente.post('visitantes', datos)
}
