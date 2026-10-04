/**
 * Agrupa una lista por la clave que devuelve `obtenerClave`, conservando el orden
 * de aparición (la API ya entrega el contenido ordenado).
 * @returns {Array<[clave, elementos[]]>}
 */
export function agruparPor(lista, obtenerClave) {
  const grupos = new Map()
  for (const elemento of lista) {
    const clave = obtenerClave(elemento)
    if (!grupos.has(clave)) grupos.set(clave, [])
    grupos.get(clave).push(elemento)
  }
  return [...grupos.entries()]
}
