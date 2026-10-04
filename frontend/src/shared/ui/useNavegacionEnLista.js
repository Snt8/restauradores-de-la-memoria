import { useState } from 'react'

/**
 * Estado de un visor que recorre una lista: qué elemento está abierto y cómo pasar
 * al anterior o al siguiente (con vuelta al inicio). Lo usan la galería y las evidencias.
 */
export function useNavegacionEnLista(cantidad) {
  const [indice, setIndice] = useState(null)
  const mover = (paso) => setIndice((actual) => (actual + paso + cantidad) % cantidad)

  return {
    indice,
    abierto: indice !== null,
    abrir: setIndice,
    cerrar: () => setIndice(null),
    anterior: cantidad > 1 ? () => mover(-1) : undefined,
    siguiente: cantidad > 1 ? () => mover(1) : undefined,
    posicion: indice === null ? null : `${indice + 1} de ${cantidad}`,
  }
}
