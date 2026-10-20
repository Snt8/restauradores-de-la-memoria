/**
 * Mapa del sitio: única fuente de las rutas, sus nombres, descripciones e íconos.
 * Lo usan la navegación lateral, el menú móvil, el pie de página y la página de inicio.
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
  foro: '/foro',
  publicacionForo: (id) => `/foro/publicaciones/${encodeURIComponent(id)}`,
  patronPublicacionForo: '/foro/publicaciones/:id',
  nuevaPublicacionForo: '/foro/publicar',
})

/**
 * @param etiqueta  nombre completo (título de la página)
 * @param corta     nombre en la navegación, donde el espacio es poco
 */
const pagina = ({ ruta, etiqueta, corta = etiqueta, descripcion, icono }) =>
  Object.freeze({ ruta, etiqueta, corta, descripcion, icono })

export const PAGINAS = Object.freeze({
  inicio: pagina({
    ruta: RUTAS.inicio,
    etiqueta: 'Inicio',
    descripcion: 'Portada del proyecto y lo más reciente.',
    icono: 'casa',
  }),
  queEs: pagina({
    ruta: RUTAS.queEs,
    etiqueta: '¿Qué es Restauradores de la Memoria?',
    corta: '¿Qué es el proyecto?',
    descripcion: 'El proyecto, su propósito y quiénes lo hacen posible.',
    icono: 'info',
  }),
  museo: pagina({
    ruta: RUTAS.museo,
    etiqueta: 'Museo Escolar de la Memoria',
    corta: 'Museo Escolar',
    descripcion: 'Ediciones, objetos, fotografías y créditos del museo.',
    icono: 'museo',
  }),
  museoVirtual: pagina({
    ruta: RUTAS.museoVirtual,
    etiqueta: 'Museo Virtual',
    descripcion: 'Recorre la sala en 3D y descubre cada objeto.',
    icono: 'cubo',
  }),
  salidas: pagina({
    ruta: RUTAS.salidas,
    etiqueta: 'Salidas Pedagógicas',
    corta: 'Salidas pedagógicas',
    descripcion: 'Recorridos por lugares de memoria de Bogotá.',
    icono: 'ubicacion',
  }),
  fechas: pagina({
    ruta: RUTAS.fechas,
    etiqueta: 'Fechas Conmemorativas',
    corta: 'Fechas conmemorativas',
    descripcion: 'Las fechas que el colegio recuerda cada año.',
    icono: 'calendario',
  }),
  eventos: pagina({
    ruta: RUTAS.eventos,
    etiqueta: 'Visitas y Eventos',
    corta: 'Visitas y eventos',
    descripcion: 'Encuentros, conversatorios y el proyecto en los medios.',
    icono: 'personas',
  }),
  reconocimientos: pagina({
    ruta: RUTAS.reconocimientos,
    etiqueta: 'Reconocimientos',
    descripcion: 'Premios y distinciones del proyecto y sus participantes.',
    icono: 'trofeo',
  }),
  alianzas: pagina({
    ruta: RUTAS.alianzas,
    etiqueta: 'Alianzas Institucionales',
    corta: 'Alianzas',
    descripcion: 'Entidades que acompañan y fortalecen el proyecto.',
    icono: 'alianza',
  }),
  galeria: pagina({
    ruta: RUTAS.galeria,
    etiqueta: 'Galería Multimedia',
    corta: 'Galería',
    descripcion: 'Fotografías, videos, audios y evidencias del proyecto.',
    icono: 'imagen',
  }),
  foro: pagina({
    ruta: RUTAS.foro,
    etiqueta: 'Foro de la Memoria',
    corta: 'Foro',
    descripcion: 'Pregunta, comparte recuerdos y conversa con la comunidad.',
    icono: 'comentario',
  }),
  contacto: pagina({
    ruta: RUTAS.contacto,
    etiqueta: 'Contacto',
    descripcion: 'Escríbenos o planea una visita al museo.',
    icono: 'correo',
  }),
})

/**
 * Navegación principal, en grupos como la barra lateral de Reddit. El primer grupo
 * no lleva título: son los accesos que más se usan.
 */
export const MENU = Object.freeze([
  { titulo: null, paginas: [PAGINAS.inicio, PAGINAS.foro, PAGINAS.galeria] },
  { titulo: 'Museo', paginas: [PAGINAS.museo, PAGINAS.museoVirtual] },
  { titulo: 'Actividades', paginas: [PAGINAS.salidas, PAGINAS.fechas, PAGINAS.eventos] },
  {
    titulo: 'El proyecto',
    paginas: [PAGINAS.queEs, PAGINAS.reconocimientos, PAGINAS.alianzas, PAGINAS.contacto],
  },
])

/** Todas las páginas del menú, en orden. */
export const PAGINAS_DEL_MENU = Object.freeze(MENU.flatMap((grupo) => grupo.paginas))

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
  PAGINAS.foro,
  PAGINAS.contacto,
])
