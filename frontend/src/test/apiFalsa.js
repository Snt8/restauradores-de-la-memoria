import { vi } from 'vitest'

export function respuestaJson(cuerpo, status = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Página de la API con todos los elementos, como la devuelve el backend. */
export function pagina(elementos, { limite = 100, desplazamiento = 0, total } = {}) {
  return { elementos, total: total ?? elementos.length, limite, desplazamiento }
}

/**
 * Reemplaza `fetch` por una API en memoria. Las rutas se declaran sin el prefijo
 * /api/v1 y opcionalmente con el método: { 'eventos': datos, 'POST visitantes': fn }.
 * Un manejador puede ser un valor (se responde como JSON), una función que recibe
 * { params, cuerpo } o un Response ya construido. Lo no declarado responde 404.
 *
 * @returns {{ fetch, peticiones }} para verificar qué pidió la interfaz
 */
export function instalarApiFalsa(rutas = {}) {
  const peticiones = []

  const fetch = vi.fn(async (url, init = {}) => {
    const { pathname, searchParams } = new URL(url, 'http://localhost')
    const ruta = pathname.replace(/^\/api\/v1\//, '')
    const metodo = init.method ?? 'GET'
    const peticion = {
      metodo,
      ruta,
      params: Object.fromEntries(searchParams),
      cuerpo: init.body ? JSON.parse(init.body) : undefined,
    }
    peticiones.push(peticion)

    const manejador = rutas[`${metodo} ${ruta}`] ?? (metodo === 'GET' ? rutas[ruta] : undefined)
    if (manejador === undefined) return respuestaJson({ detail: 'No encontrado' }, 404)

    const resultado = typeof manejador === 'function' ? await manejador(peticion) : manejador
    return resultado instanceof Response ? resultado : respuestaJson(resultado)
  })

  vi.stubGlobal('fetch', fetch)
  return { fetch, peticiones }
}
