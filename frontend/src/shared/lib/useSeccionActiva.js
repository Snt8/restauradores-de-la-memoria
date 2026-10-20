import { useEffect, useState } from 'react'

/**
 * Id de la sección que se está leyendo: la primera que cruza la franja superior de la
 * pantalla. Sirve para resaltar el índice «En esta página». Sin IntersectionObserver
 * (navegadores muy viejos, pruebas) simplemente no resalta ninguna.
 */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(null)
  const clave = ids.join('|')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const elementos = clave
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visibles.length > 0) setActiva(visibles[0].target.id)
      },
      // Franja entre el 15 % y el 35 % del alto: lo que el lector tiene frente a sus ojos.
      { rootMargin: '-15% 0px -65% 0px' },
    )
    for (const elemento of elementos) observador.observe(elemento)
    return () => observador.disconnect()
  }, [clave])

  return activa
}
