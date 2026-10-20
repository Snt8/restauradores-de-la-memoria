/**
 * Validación de los formularios del foro. Replica los límites de la API para responder
 * al instante; la API vuelve a validar porque es la única fuente de verdad.
 */

export const LIMITES_FORO = Object.freeze({
  titulo: { minimo: 5, maximo: 200 },
  contenido: { minimo: 1, maximo: 10_000 },
  comentario: { minimo: 1, maximo: 5_000 },
  autor: { minimo: 2, maximo: 60 },
})

function validarLongitud(errores, campo, valor, { minimo, maximo }, mensajeVacio) {
  const largo = valor.trim().length
  if (largo < minimo) errores[campo] = mensajeVacio
  else if (largo > maximo) errores[campo] = `Máximo ${maximo.toLocaleString('es-CO')} caracteres.`
}

const validarAutor = (errores, autor) =>
  validarLongitud(
    errores,
    'autor',
    autor,
    LIMITES_FORO.autor,
    'Escribe cómo quieres firmar (mínimo 2 caracteres).',
  )

/** @returns {Record<string, string>} mensaje de error por campo; vacío si todo es válido */
export function validarPublicacion({ categoria, titulo, contenido, autor }) {
  const errores = {}
  if (!categoria) errores.categoria = 'Elige la categoría de tu publicación.'
  validarLongitud(
    errores,
    'titulo',
    titulo,
    LIMITES_FORO.titulo,
    'Escribe un título de al menos 5 caracteres.',
  )
  validarLongitud(
    errores,
    'contenido',
    contenido,
    LIMITES_FORO.contenido,
    'Cuéntanos de qué quieres hablar.',
  )
  validarAutor(errores, autor)
  return errores
}

export function validarComentario({ contenido, autor }) {
  const errores = {}
  validarLongitud(
    errores,
    'contenido',
    contenido,
    LIMITES_FORO.comentario,
    'Escribe tu comentario antes de enviarlo.',
  )
  validarAutor(errores, autor)
  return errores
}

/** Mismos datos sin espacios sobrantes al inicio y al final, listos para la API. */
export function recortar(datos) {
  return Object.fromEntries(
    Object.entries(datos).map(([campo, valor]) => [
      campo,
      typeof valor === 'string' ? valor.trim() : valor,
    ]),
  )
}
