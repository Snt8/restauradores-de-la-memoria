import {
  fechaParaAtributo,
  formatearFecha,
  TEXTO_FECHA_POR_CONFIRMAR,
} from '@/shared/lib/fechas.js'

/** Fecha parcial legible y semántica (<time>), o «Fecha por confirmar» si no se conoce. */
export function Fecha({ fecha, className = '' }) {
  const texto = formatearFecha(fecha)
  if (!texto) return <span className={`italic ${className}`}>{TEXTO_FECHA_POR_CONFIRMAR}</span>
  return (
    <time dateTime={fechaParaAtributo(fecha)} className={className}>
      {texto}
    </time>
  )
}
