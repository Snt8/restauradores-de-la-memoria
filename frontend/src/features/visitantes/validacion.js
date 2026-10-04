/**
 * Validación del formulario de visitantes. Replica las reglas de la API para dar
 * respuesta inmediata; la API vuelve a validar porque es la única fuente de verdad.
 */

export const VISITANTE_VACIO = Object.freeze({
  nombre: '',
  correo: '',
  institucion: '',
  rol: '',
  mensaje: '',
  consentimiento_datos: false,
})

export const LIMITES = Object.freeze({
  nombre: 120,
  correo: 254,
  institucion: 150,
  rol: 80,
  mensaje: 2000,
})

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @returns {Record<string, string>} mensaje de error por campo; vacío si todo es válido */
export function validarVisitante(datos, { exigeMensaje }) {
  const errores = {}
  const nombre = datos.nombre.trim()
  const correo = datos.correo.trim()

  if (nombre.length < 2) errores.nombre = 'Escribe tu nombre (mínimo 2 caracteres).'
  if (!CORREO.test(correo))
    errores.correo = 'Escribe un correo válido, por ejemplo nombre@dominio.co.'
  if (exigeMensaje && !datos.mensaje.trim()) errores.mensaje = 'Cuéntanos en qué podemos ayudarte.'

  for (const [campo, limite] of Object.entries(LIMITES)) {
    if (!errores[campo] && datos[campo].trim().length > limite) {
      errores[campo] = `Máximo ${limite} caracteres.`
    }
  }

  if (!datos.consentimiento_datos) {
    errores.consentimiento_datos = 'Necesitamos tu autorización para guardar tus datos.'
  }
  return errores
}

/** Datos listos para la API: sin espacios sobrantes y sin campos opcionales vacíos. */
export function aCargaUtil(datos, origen) {
  const carga = { origen, consentimiento_datos: datos.consentimiento_datos }
  for (const campo of Object.keys(LIMITES)) {
    const valor = datos[campo].trim()
    if (valor) carga[campo] = valor
  }
  return carga
}
