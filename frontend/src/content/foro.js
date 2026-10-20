/**
 * Textos fijos del foro: categorías, órdenes del muro y normas de convivencia.
 * Los valores de `CATEGORIAS_FORO` y `ORDENES_FORO` son los mismos que acepta la API.
 * Las normas son una propuesta del equipo: el docente debe validarlas antes de publicar.
 */

export const CATEGORIAS_FORO = Object.freeze([
  {
    valor: 'general',
    etiqueta: 'General',
    descripcion: 'Conversación abierta sobre el proyecto.',
    tono: 'neutro',
  },
  {
    valor: 'museo',
    etiqueta: 'Museo de la Memoria',
    descripcion: 'Objetos, exposiciones y el recorrido virtual.',
    tono: 'memoria',
  },
  {
    valor: 'salidas',
    etiqueta: 'Salidas pedagógicas',
    descripcion: 'Lo que vivimos en los lugares de memoria.',
    tono: 'vela',
  },
  {
    valor: 'historias',
    etiqueta: 'Historias y testimonios',
    descripcion: 'Recuerdos del colegio, del barrio y de la ciudad.',
    tono: 'rosa',
  },
  {
    valor: 'preguntas',
    etiqueta: 'Preguntas',
    descripcion: 'Dudas sobre el proyecto, las visitas o las actividades.',
    tono: 'cielo',
  },
])

export const CATEGORIA_POR_VALOR = Object.freeze(
  Object.fromEntries(CATEGORIAS_FORO.map((categoria) => [categoria.valor, categoria])),
)

export const ORDENES_FORO = Object.freeze([
  { valor: null, etiqueta: 'Populares', icono: 'llama' },
  { valor: 'recientes', etiqueta: 'Recientes', icono: 'reloj' },
  { valor: 'mejores', etiqueta: 'Más votadas', icono: 'trofeo' },
])

export const FORO = Object.freeze({
  presentacion:
    'Un espacio para que estudiantes, docentes, familias y visitantes conversen sobre la memoria: preguntas, recuerdos, reflexiones de las salidas y lo que despierta cada objeto del museo.',
  normas: [
    'Respeta a las víctimas, a sus familias y a cada persona que participa.',
    'Comparte recuerdos propios o con permiso de quien los cuenta.',
    'No publiques datos personales: teléfonos, direcciones ni documentos.',
    'Mantén la conversación sobre la memoria, el museo y el proyecto.',
    'Si algo te incomoda, avísanos desde la página de Contacto.',
  ],
})
