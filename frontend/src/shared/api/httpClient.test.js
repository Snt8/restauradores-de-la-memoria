import { describe, expect, it, vi } from 'vitest'
import { ApiError, createHttpClient } from './httpClient.js'

function jsonResponse(body, { status = 200 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function setup(response) {
  const fetchFn = vi.fn().mockResolvedValue(response)
  const client = createHttpClient({ baseUrl: '/api/v1/', fetchFn })
  return { client, fetchFn }
}

describe('createHttpClient', () => {
  it('hace GET uniendo baseUrl y path y devuelve el JSON', async () => {
    const { client, fetchFn } = setup(jsonResponse({ status: 'ok' }))

    const result = await client.get('/health')

    expect(result).toEqual({ status: 'ok' })
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('/api/v1/health')
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
    expect(init.headers).not.toHaveProperty('Content-Type')
  })

  it('serializa los parámetros de consulta omitiendo null y undefined', async () => {
    const { client, fetchFn } = setup(jsonResponse([]))

    await client.get('eventos', {
      params: { tipo: 'visita', anio: 2024, lugar: null, q: undefined },
    })

    expect(fetchFn.mock.calls[0][0]).toBe('/api/v1/eventos?tipo=visita&anio=2024')
  })

  it('hace POST enviando el cuerpo como JSON', async () => {
    const { client, fetchFn } = setup(jsonResponse({ id: 1 }, { status: 201 }))

    const result = await client.post('visitantes', { nombre: 'Ana' })

    expect(result).toEqual({ id: 1 })
    const [, init] = fetchFn.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"nombre":"Ana"}')
    expect(init.headers['Content-Type']).toBe('application/json')
  })

  it('devuelve null en respuestas 204', async () => {
    const { client } = setup(new Response(null, { status: 204 }))

    await expect(client.get('algo')).resolves.toBeNull()
  })

  it('lanza ApiError con status y cuerpo cuando la respuesta no es exitosa', async () => {
    const { client } = setup(jsonResponse({ detail: 'No encontrado' }, { status: 404 }))

    const error = await client.get('objetos/99').catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
    expect(error.body).toEqual({ detail: 'No encontrado' })
  })

  it('lanza ApiError con status 0 cuando falla la red', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const client = createHttpClient({ baseUrl: '/api/v1', fetchFn })

    const error = await client.get('health').catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.cause).toBeInstanceOf(TypeError)
  })

  it('propaga las cancelaciones sin envolverlas', async () => {
    const abort = new DOMException('Aborted', 'AbortError')
    const fetchFn = vi.fn().mockRejectedValue(abort)
    const client = createHttpClient({ baseUrl: '/api/v1', fetchFn })

    await expect(client.get('health')).rejects.toBe(abort)
  })
})
