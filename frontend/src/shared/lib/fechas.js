const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export const TEXTO_FECHA_POR_CONFIRMAR = 'Fecha por confirmar'

const dosDigitos = (numero) => String(numero).padStart(2, '0')

/**
 * Convierte la fecha parcial de la API ({ anio, mes, dia }) en texto legible,
 * con exactamente la precisión que tiene: «2022», «octubre de 2023»,
 * «22 de octubre de 2025» o, si no tiene año, «9 de abril». Sin datos devuelve null.
 */
export function formatearFecha(fecha) {
  const { anio, mes, dia } = fecha ?? {}
  const nombreMes = mes ? MESES[mes - 1] : null

  if (anio && nombreMes && dia) return `${dia} de ${nombreMes} de ${anio}`
  if (anio && nombreMes) return `${nombreMes} de ${anio}`
  if (anio) return String(anio)
  if (nombreMes && dia) return `${dia} de ${nombreMes}`
  return null
}

/** Valor para el atributo `datetime` de <time>, en un formato válido de HTML. */
export function fechaParaAtributo(fecha) {
  const { anio, mes, dia } = fecha ?? {}
  if (anio && mes && dia) return `${anio}-${dosDigitos(mes)}-${dosDigitos(dia)}`
  if (anio && mes) return `${anio}-${dosDigitos(mes)}`
  if (anio) return String(anio)
  if (mes && dia) return `--${dosDigitos(mes)}-${dosDigitos(dia)}`
  return null
}

/** Partes para mostrar una conmemoración como hoja de calendario: { dia: '9', mes: 'abril' }. */
export function partesDeCalendario(fecha) {
  const { mes, dia } = fecha ?? {}
  if (!mes || !dia) return null
  return { dia: String(dia), mes: MESES[mes - 1] }
}
