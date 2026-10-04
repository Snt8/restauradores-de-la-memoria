/** Variables de entorno de la aplicación, centralizadas en un único punto. */
export const env = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  // Ruta pública desde la que se sirve el portal (permite publicarlo en un subdirectorio).
  baseUrl: import.meta.env.BASE_URL || '/',
})
