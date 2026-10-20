/** Clases y textos que comparten varias piezas del foro (no son componentes). */

export const CLASE_TARJETA_FORO =
  'rounded-tarjeta border border-linea bg-superficie shadow-[0_1px_2px_rgb(27_25_22/0.05)]'

export const CLASE_ACCION =
  'relative z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-tinta-suave transition-colors hover:bg-tinta/10 hover:text-tinta'

export function textoDeComentarios(cantidad) {
  return cantidad === 1 ? '1 comentario' : `${cantidad.toLocaleString('es-CO')} comentarios`
}
