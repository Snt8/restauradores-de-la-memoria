/**
 * Identidad anónima de quien participa en el foro, guardada solo en su navegador:
 * - un id de votante (UUID) para que cada navegador tenga un único voto por elemento;
 * - el nombre con el que firmó por última vez, para no pedirlo en cada comentario.
 * Si el almacenamiento no está disponible (modo privado, bloqueado), se usa memoria.
 */

const CLAVE_VOTANTE = 'restauradores:foro:votante'
const CLAVE_NOMBRE = 'restauradores:foro:nombre'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const enMemoria = new Map()

function leer(clave, almacen) {
  try {
    return almacen.getItem(clave)
  } catch {
    return enMemoria.get(clave) ?? null
  }
}

function guardar(clave, valor, almacen) {
  try {
    almacen.setItem(clave, valor)
  } catch {
    // Sin almacenamiento persistente: el valor vive mientras la pestaña esté abierta.
    enMemoria.set(clave, valor)
  }
}

function nuevoUuid() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  // randomUUID solo existe en contextos seguros; esta versión 4 sirve en cualquier origen.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const almacenPorDefecto = () => globalThis.localStorage

export function idDeVotante(almacen = almacenPorDefecto()) {
  const guardado = leer(CLAVE_VOTANTE, almacen)
  if (guardado && UUID.test(guardado)) return guardado
  const nuevo = nuevoUuid()
  guardar(CLAVE_VOTANTE, nuevo, almacen)
  return nuevo
}

export function nombreGuardado(almacen = almacenPorDefecto()) {
  return leer(CLAVE_NOMBRE, almacen) ?? ''
}

export function recordarNombre(nombre, almacen = almacenPorDefecto()) {
  guardar(CLAVE_NOMBRE, nombre, almacen)
}
