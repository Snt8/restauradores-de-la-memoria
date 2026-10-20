/**
 * Clases del sistema visual del portal (inspirado en Reddit): tarjetas blancas con borde
 * fino sobre el fondo `fondo-foro`, y acciones discretas en forma de píldora.
 */

export const CLASE_TARJETA =
  'rounded-tarjeta border border-linea bg-superficie shadow-[0_1px_2px_rgb(27_25_22/0.05)]'

/** Tarjeta que además reacciona al pasar el mouse (cuando toda ella es un enlace). */
export const CLASE_TARJETA_ENLAZADA = `${CLASE_TARJETA} transition hover:border-tinta/30 hover:shadow-tarjeta`

export const CLASE_ACCION =
  'relative z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-tinta-suave transition-colors hover:bg-tinta/10 hover:text-tinta'
