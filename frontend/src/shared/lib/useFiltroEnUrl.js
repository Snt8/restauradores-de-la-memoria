import { useSearchParams } from 'react-router'

/**
 * Filtro guardado en la URL (?tipo=medios): se puede compartir el enlace, recargar la
 * página o usar «atrás» sin perder la selección. Ignora valores que no estén permitidos.
 *
 * @returns {[string|null, (valor: string|null) => void]}
 */
export function useFiltroEnUrl(nombre, valoresPermitidos) {
  const [parametros, setParametros] = useSearchParams()
  const actual = parametros.get(nombre)
  const valor = valoresPermitidos.includes(actual) ? actual : null

  function cambiar(nuevo) {
    setParametros(
      (previos) => {
        const siguientes = new URLSearchParams(previos)
        if (nuevo) siguientes.set(nombre, nuevo)
        else siguientes.delete(nombre)
        return siguientes
      },
      { replace: true, preventScrollReset: true },
    )
  }

  return [valor, cambiar]
}
