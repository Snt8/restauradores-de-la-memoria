import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders.jsx'
import { createQueryClient } from '@/app/providers/queryClient.js'
import { routes } from '@/app/router/routes.jsx'

/**
 * Renderiza la aplicación real (rutas + providers) en una URL dada,
 * usando un router en memoria y una caché aislada por prueba.
 */
export function renderRoute(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const queryClient = createQueryClient({ queries: { retry: false } })

  return {
    router,
    ...render(
      <AppProviders queryClient={queryClient}>
        <RouterProvider router={router} />
      </AppProviders>,
    ),
  }
}
