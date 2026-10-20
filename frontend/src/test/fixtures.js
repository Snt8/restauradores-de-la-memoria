/**
 * Constructores de datos con la misma forma que la API. Cada prueba sobrescribe
 * solo lo que le importa; el resto toma valores por defecto realistas.
 */

let siguienteId = 1
const nuevoId = () => siguienteId++

export const sinFecha = () => ({ anio: null, mes: null, dia: null })

export function evidencia(cambios = {}) {
  return {
    id: nuevoId(),
    tipo: 'foto',
    url: 'media/museo/2025-danza',
    titulo: 'Presentación de danza',
    descripcion: null,
    fecha: sinFecha(),
    creditos: 'Archivo del proyecto',
    ...cambios,
  }
}

function contenido(cambios) {
  const id = nuevoId()
  return { id, slug: `contenido-${id}`, nombre: `Contenido ${id}`, evidencias: [], ...cambios }
}

export const exposicion = (cambios = {}) =>
  contenido({
    nombre: 'Museo Escolar de la Memoria 2025',
    descripcion: 'Quinta versión del museo.',
    lugar: 'Colegio Tom Adams IED',
    fecha: { anio: 2025, mes: 11, dia: null },
    ...cambios,
  })

export const objeto = (cambios = {}) =>
  contenido({
    slug: 'pieza-de-prueba',
    nombre: 'Pieza de prueba',
    descripcion: 'Modelo 3D provisional.',
    importancia_memoria: 'Pendiente.',
    foto_url: null,
    modelo_3d_url: 'models/pieza-prueba-caja.glb',
    creditos: 'Equipo de desarrollo',
    fecha: sinFecha(),
    ubicacion: { x: -2, y: 1, z: -5, rotacion_y: 20, escala: 1.5 },
    orden: 1,
    exposiciones: [],
    ...cambios,
  })

export const evento = (cambios = {}) =>
  contenido({
    tipo: 'evento',
    fecha: sinFecha(),
    lugar: null,
    descripcion: null,
    ...cambios,
  })

export const actividad = (cambios = {}) =>
  contenido({
    tipo: 'salida_pedagogica',
    fecha: sinFecha(),
    lugar: null,
    descripcion: null,
    ...cambios,
  })

export const reconocimiento = (cambios = {}) =>
  contenido({ otorgante: null, fecha: sinFecha(), descripcion: null, ...cambios })

export const aliado = (cambios = {}) =>
  contenido({ tipo: null, descripcion: null, logo_url: null, sitio_web: null, ...cambios })

let minuto = 0
const instante = () => new Date(Date.UTC(2026, 9, 20, 12, minuto++)).toISOString()

export const publicacionForo = (cambios = {}) => ({
  id: nuevoId(),
  categoria: 'museo',
  titulo: '¿Qué objeto del museo les impactó más?',
  contenido: 'Yo elijo el altar de la sanación.',
  autor: 'Ana',
  creado_en: instante(),
  puntaje: 0,
  comentarios: 0,
  mi_voto: 0,
  ...cambios,
})

export const comentarioForo = (cambios = {}) => ({
  id: nuevoId(),
  publicacion_id: 1,
  padre_id: null,
  contenido: 'Muy buen aporte.',
  autor: 'Luis',
  creado_en: instante(),
  puntaje: 0,
  mi_voto: 0,
  ...cambios,
})

export const elementoDeGaleria = (cambios = {}) => ({
  evidencia: evidencia(),
  seccion: 'museo',
  contexto: 'Museo Escolar de la Memoria 2025',
  ...cambios,
})
