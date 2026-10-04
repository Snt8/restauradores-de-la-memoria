/** Error de la API con el código HTTP y el cuerpo de la respuesta. status 0 = sin conexión. */
export class ApiError extends Error {
  constructor(message, { status, body = null, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function buildUrl(baseUrl, path, params) {
  const url = `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
  if (!params) return url

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) query.append(key, String(value))
  }
  const queryString = query.toString()
  return queryString ? `${url}?${queryString}` : url
}

async function parseBody(response) {
  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json()
  const text = await response.text()
  return text || null
}

/**
 * Crea un cliente HTTP JSON.
 * `fetchFn` se inyecta para poder sustituirlo en pruebas o en otros entornos. Por defecto
 * se resuelve `fetch` en cada petición (no al crear el cliente), así funcionan los polyfills
 * y los dobles de prueba instalados después.
 */
export function createHttpClient({ baseUrl, fetchFn = (...args) => globalThis.fetch(...args) }) {
  async function request(path, { method, params, body, signal } = {}) {
    const hasBody = body !== undefined
    let response

    try {
      response = await fetchFn(buildUrl(baseUrl, path, params), {
        method,
        signal,
        headers: {
          Accept: 'application/json',
          ...(hasBody && { 'Content-Type': 'application/json' }),
        },
        body: hasBody ? JSON.stringify(body) : undefined,
      })
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      throw new ApiError('No fue posible conectar con el servidor.', { status: 0, cause: error })
    }

    const payload = await parseBody(response)
    if (!response.ok) {
      throw new ApiError(`La petición falló con el código ${response.status}.`, {
        status: response.status,
        body: payload,
      })
    }
    return payload
  }

  return {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  }
}
