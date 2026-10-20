/**
 * La API entrega los comentarios planos (cada uno con su `padre_id`); aquí se arma el
 * hilo. Dentro de cada nivel, primero los mejor votados y, a igual puntaje, los más
 * antiguos (o los más nuevos, si se pide), como en Reddit.
 */

const COMPARADORES = Object.freeze({
  mejores: (a, b) => b.puntaje - a.puntaje || a.creado_en.localeCompare(b.creado_en),
  recientes: (a, b) => b.creado_en.localeCompare(a.creado_en),
})

export const ORDENES_DE_COMENTARIOS = Object.freeze([
  { valor: null, etiqueta: 'Mejores' },
  { valor: 'recientes', etiqueta: 'Recientes' },
])

/** @returns {Array<{...comentario, respuestas: Array}>} raíces del hilo, ordenadas */
export function armarHilo(comentarios, orden = 'mejores') {
  const nodos = new Map(comentarios.map((c) => [c.id, { ...c, respuestas: [] }]))
  const raices = []
  for (const nodo of nodos.values()) {
    const padre = nodo.padre_id === null ? null : nodos.get(nodo.padre_id)
    // Un comentario cuyo padre no llegó se muestra en la raíz en vez de perderse.
    ;(padre ? padre.respuestas : raices).push(nodo)
  }

  const comparar = COMPARADORES[orden] ?? COMPARADORES.mejores
  const ordenar = (lista) => {
    lista.sort(comparar)
    for (const nodo of lista) ordenar(nodo.respuestas)
    return lista
  }
  return ordenar(raices)
}

/** Total de comentarios dentro de un hilo (sin contar la raíz). */
export function contarRespuestas(nodo) {
  return nodo.respuestas.reduce((total, hijo) => total + 1 + contarRespuestas(hijo), 0)
}
