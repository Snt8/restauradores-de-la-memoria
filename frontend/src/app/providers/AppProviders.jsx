import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { createQueryClient } from './queryClient.js'

/** Agrupa los providers globales de la aplicación. */
export function AppProviders({ children, queryClient }) {
  const [client] = useState(() => queryClient ?? createQueryClient())

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
