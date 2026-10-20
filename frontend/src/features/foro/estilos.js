/** Textos y clases que comparten varias piezas del foro (no son componentes). */

export { CLASE_ACCION, CLASE_TARJETA as CLASE_TARJETA_FORO } from '@/shared/ui/estilos.js'

export function textoDeComentarios(cantidad) {
  return cantidad === 1 ? '1 comentario' : `${cantidad.toLocaleString('es-CO')} comentarios`
}
