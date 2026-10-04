import { QueryClient } from '@tanstack/react-query'

const FIVE_MINUTES = 5 * 60 * 1000

/**
 * Crea el cliente de caché de consultas.
 * El contenido del portal cambia poco, así que se mantiene fresco 5 minutos
 * para evitar peticiones repetidas al navegar entre secciones.
 */
export function createQueryClient(overrides = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES,
        refetchOnWindowFocus: false,
        retry: 1,
        ...overrides.queries,
      },
    },
  })
}
