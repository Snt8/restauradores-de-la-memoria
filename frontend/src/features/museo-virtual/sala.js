/**
 * Geometría de la sala del Museo Virtual (metros y grados, convención de A-Frame:
 * Y hacia arriba y el visitante empieza mirando hacia -Z). Solo funciones puras:
 * la escena las usa y las pruebas las verifican sin WebGL.
 */

export const SALA = Object.freeze({
  ancho: 14,
  fondo: 16,
  alto: 4.2,
  entradaZ: 2,
  // Margen para que el visitante no atraviese los muros.
  margen: 0.6,
  alturaOjos: 1.6,
  inicio: Object.freeze({ x: 0, z: 1 }),
})

export const LIMITES = Object.freeze({
  minX: -SALA.ancho / 2 + SALA.margen,
  maxX: SALA.ancho / 2 - SALA.margen,
  minZ: SALA.entradaZ - SALA.fondo + SALA.margen,
  maxZ: SALA.entradaZ - SALA.margen,
})

const acotar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo)

/** Mantiene una posición (x, z) dentro de la sala. */
export function limitarPosicion({ x, z }, limites = LIMITES) {
  return { x: acotar(x, limites.minX, limites.maxX), z: acotar(z, limites.minZ, limites.maxZ) }
}

/** Ángulo (grados, eje Y) para que algo en `desde` mire hacia `hacia`. */
export function anguloHacia(desde, hacia) {
  const radianes = Math.atan2(desde.x - hacia.x, desde.z - hacia.z)
  return Math.round(((radianes * 180) / Math.PI) * 100) / 100
}

/**
 * Paradas de la visita guiada: una por objeto, en su orden, con el visitante de pie a
 * `distancia` metros del pedestal (hacia el centro de la sala) y mirándolo de frente.
 */
export function paradasDelRecorrido(objetos, distancia = 2.2) {
  return [...objetos]
    .sort((a, b) => a.orden - b.orden)
    .map((objeto) => {
      const pieza = { x: objeto.ubicacion.x, z: objeto.ubicacion.z }
      const haciaElCentro = Math.sign(-pieza.x) * 0.35
      const posicion = limitarPosicion({ x: pieza.x + haciaElCentro, z: pieza.z + distancia })
      return {
        slug: objeto.slug,
        nombre: objeto.nombre,
        posicion,
        rotacionY: anguloHacia(posicion, pieza),
      }
    })
}

/**
 * Lugares para cuadros en los muros: izquierdo, derecho y del fondo.
 * Cada lugar trae su posición sobre el muro y la rotación para mirar hacia la sala.
 */
export function lugaresEnMuros({ porMuroLateral = 5, enFondo = 4, alturaCentro = 2 } = {}) {
  const x = SALA.ancho / 2 - 0.05
  const fondoZ = SALA.entradaZ - SALA.fondo + 0.05
  const tramoLateral = (SALA.fondo - 3.5) / porMuroLateral
  const tramoFondo = (SALA.ancho - 3) / enFondo
  const lugares = []

  for (let i = 0; i < porMuroLateral; i += 1) {
    const z = SALA.entradaZ - 2.5 - tramoLateral * (i + 0.5)
    lugares.push({ posicion: { x: -x, y: alturaCentro, z }, rotacionY: 90 })
    lugares.push({ posicion: { x, y: alturaCentro, z }, rotacionY: -90 })
  }
  for (let i = 0; i < enFondo; i += 1) {
    const posX = -SALA.ancho / 2 + 1.5 + tramoFondo * (i + 0.5)
    lugares.push({ posicion: { x: posX, y: alturaCentro, z: fondoZ }, rotacionY: 0 })
  }
  return lugares
}

/**
 * Elige qué fotografías colgar: recorre las exposiciones (de la más reciente a la más
 * antigua) tomando una foto de cada una por ronda, para que todas las ediciones tengan
 * presencia en la sala antes de repetir.
 */
export function seleccionarFotos(exposiciones, cantidad) {
  const colas = exposiciones.map((exposicion) => ({
    exposicion,
    fotos: exposicion.evidencias.filter((e) => e.tipo === 'foto'),
  }))
  const elegidas = []
  for (let ronda = 0; elegidas.length < cantidad; ronda += 1) {
    const deEstaRonda = colas.filter((cola) => cola.fotos[ronda])
    if (deEstaRonda.length === 0) break
    for (const { exposicion, fotos } of deEstaRonda) {
      if (elegidas.length === cantidad) break
      elegidas.push({ evidencia: fotos[ronda], exposicion: exposicion.nombre })
    }
  }
  return elegidas
}

/** Une las fotos elegidas con los lugares de los muros. */
export function distribuirCuadros(exposiciones, lugares = lugaresEnMuros()) {
  return seleccionarFotos(exposiciones, lugares.length).map((foto, i) => ({
    ...foto,
    ...lugares[i],
  }))
}

/** Tamaño de un cuadro que respeta la proporción de la foto sin pasar de los máximos. */
export function tamanoDeCuadro(proporcion, { anchoMaximo = 1.9, altoMaximo = 1.5 } = {}) {
  const segura = proporcion > 0 && Number.isFinite(proporcion) ? proporcion : 1.5
  const ancho = Math.min(anchoMaximo, altoMaximo * segura)
  return { ancho: redondear(ancho), alto: redondear(ancho / segura) }
}

/** Giro de un modelo al arrastrar: cada píxel horizontal equivale a `sensibilidad` grados. */
export function rotacionTrasArrastre(rotacionY, desplazamientoX, sensibilidad = 0.4) {
  return (rotacionY + desplazamientoX * sensibilidad) % 360
}

/** Vector en el formato de texto de A-Frame: «x y z». */
export function vec3({ x = 0, y = 0, z = 0 }) {
  return `${redondear(x)} ${redondear(y)} ${redondear(z)}`
}

function redondear(numero) {
  return Math.round(numero * 1000) / 1000
}
