/**
 * Mapa del sitio: única fuente de las rutas, sus nombres y descripciones.
 * Lo usan el encabezado, el pie de página y los accesos de la página de inicio.
 */

export const RUTAS = Object.freeze({
  inicio: '/',
  queEs: '/que-es',
  museo: '/museo',
  objeto: (slug) => `/museo/objetos/${encodeURIComponent(slug)}`,
  patronObjeto: '/museo/objetos/:slug',
  museoVirtual: '/museo/virtual',
  salidas: '/salidas-pedagogicas',
  fechas: '/fechas-conmemorativas',
  eventos: '/visitas-y-eventos',
  reconocimientos: '/reconocimientos',
  alianzas: '/alianzas',
  galeria: '/galeria',
  contacto: '/contacto',
})

const pagina = (ruta, etiqueta, descripcion) => Object.freeze({ ruta, etiqueta, descripcion })

export const PAGINAS = Object.freeze({
  queEs: pagina(
    RUTAS.queEs,
    '¿Qué es Restauradores de la Memoria?',
    'El proyecto, su propósito y quiénes lo hacen posible.',
  ),
  museo: pagina(
    RUTAS.museo,
    'Museo Escolar de la Memoria',
    'Ediciones, objetos, fotografías y créditos del museo.',
  ),
  museoVirtual: pagina(
    RUTAS.museoVirtual,
    'Museo Virtual',
    'Recorre la sala en 3D y descubre cada objeto.',
  ),
  salidas: pagina(
    RUTAS.salidas,
    'Salidas Pedagógicas',
    'Recorridos por lugares de memoria de Bogotá.',
  ),
  fechas: pagina(
    RUTAS.fechas,
    'Fechas Conmemorativas',
    'Las fechas que el colegio recuerda cada año.',
  ),
  eventos: pagina(
    RUTAS.eventos,
    'Visitas y Eventos',
    'Encuentros, conversatorios y el proyecto en los medios.',
  ),
  reconocimientos: pagina(
    RUTAS.reconocimientos,
    'Reconocimientos',
    'Premios y distinciones del proyecto y sus participantes.',
  ),
  alianzas: pagina(
    RUTAS.alianzas,
    'Alianzas Institucionales',
    'Entidades que acompañan y fortalecen el proyecto.',
  ),
  galeria: pagina(
    RUTAS.galeria,
    'Galería Multimedia',
    'Fotografías, videos, audios y evidencias del proyecto.',
  ),
  contacto: pagina(RUTAS.contacto, 'Contacto', 'Escríbenos o planea una visita al museo.'),
})

/**
 * Menú principal. Los grupos agrupan secciones relacionadas para que el menú
 * no pase de siete entradas en pantallas grandes.
 */
export const MENU = Object.freeze([
  { etiqueta: 'Inicio', ruta: RUTAS.inicio },
  { etiqueta: 'El proyecto', ruta: RUTAS.queEs },
  {
    etiqueta: 'Museo',
    paginas: [PAGINAS.museo, PAGINAS.museoVirtual],
  },
  {
    etiqueta: 'Actividades',
    paginas: [PAGINAS.salidas, PAGINAS.fechas, PAGINAS.eventos],
  },
  { etiqueta: 'Reconocimientos', ruta: RUTAS.reconocimientos },
  { etiqueta: 'Alianzas', ruta: RUTAS.alianzas },
  { etiqueta: 'Galería', ruta: RUTAS.galeria },
  { etiqueta: 'Contacto', ruta: RUTAS.contacto },
])

/** Accesos de la página de inicio, en orden de lectura. */
export const ACCESOS_PRINCIPALES = Object.freeze([
  PAGINAS.queEs,
  PAGINAS.museo,
  PAGINAS.salidas,
  PAGINAS.fechas,
  PAGINAS.eventos,
  PAGINAS.reconocimientos,
  PAGINAS.alianzas,
  PAGINAS.galeria,
  PAGINAS.contacto,
])
