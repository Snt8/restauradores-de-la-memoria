import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { recursos } from '@/shared/api/recursos.js'
import { agruparPor } from '@/shared/lib/agrupar.js'
import { TEXTO_FECHA_POR_CONFIRMAR } from '@/shared/lib/fechas.js'

export const idDeAnio = (anio) => `anio-${anio ?? 'sin-fecha'}`

export const nombreDeAnio = (anio) => (anio == null ? TEXTO_FECHA_POR_CONFIRMAR : String(anio))

/**
 * Salidas pedagógicas agrupadas por año (las que no tienen año, al final, como las
 * ordena la API). La página usa la misma consulta para el muro y para el índice de años.
 */
export function useSalidasPorAnio() {
  const consulta = useQuery(recursos.actividades.lista({ tipo: 'salida_pedagogica' }))
  const elementos = consulta.data?.elementos
  const grupos = useMemo(
    () => (elementos ? agruparPor(elementos, (salida) => salida.fecha.anio) : []),
    [elementos],
  )
  return { consulta, grupos }
}
