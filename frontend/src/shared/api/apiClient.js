import { env } from '@/shared/config/env.js'
import { createHttpClient } from './httpClient.js'

/** Instancia única del cliente HTTP que usan las features para hablar con la API. */
export const apiClient = createHttpClient({ baseUrl: env.apiBaseUrl })
