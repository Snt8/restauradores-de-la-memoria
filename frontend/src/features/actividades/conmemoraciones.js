import { useQuery } from '@tanstack/react-query'
import { recursos } from '@/shared/api/recursos.js'

const UN_DIA = 24 * 60 * 60 * 1000

export const idDeConmemoracion = (conmemoracion) => `fecha-${conmemoracion.slug}`

export function useConmemoraciones() {
  return useQuery(recursos.actividades.lista({ tipo: 'fecha_conmemorativa' }))
}

/**
 * La conmemoración que viene (o la de hoy) y cuántos días faltan. Las fechas se repiten
 * cada año: si la de este año ya pasó, cuenta hasta la del próximo.
 *
 * @returns {{ conmemoracion, dias } | null} null si ninguna tiene día y mes
 */
export function proximaConmemoracion(conmemoraciones, hoy = new Date()) {
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  let proxima = null

  for (const conmemoracion of conmemoraciones) {
    const { mes, dia } = conmemoracion.fecha
    if (!mes || !dia) continue
    let destino = new Date(inicio.getFullYear(), mes - 1, dia)
    if (destino < inicio) destino = new Date(inicio.getFullYear() + 1, mes - 1, dia)
    // Math.round absorbe la hora de diferencia de los cambios de horario.
    const dias = Math.round((destino - inicio) / UN_DIA)
    if (!proxima || dias < proxima.dias) proxima = { conmemoracion, dias }
  }
  return proxima
}

export function textoDeDiasRestantes(dias) {
  if (dias === 0) return 'Es hoy'
  if (dias === 1) return 'Es mañana'
  return `Faltan ${dias} días`
}
