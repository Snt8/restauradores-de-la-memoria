/**
 * Textos institucionales fijos del portal.
 *
 * Fuentes: presentación «Restauradores de la Memoria» (docente), archivo «Evidencias
 * proyecto 2025», comunicación del CNMH (READH, agosto de 2026) y la Ley 1448 de 2011.
 * El contenido que cambia con el tiempo (eventos, salidas, reconocimientos…) no vive
 * aquí: llega de la API. Antes de publicar, el docente debe validar estos textos.
 */

export const PROYECTO = Object.freeze({
  nombre: 'Restauradores de la Memoria',
  lema: 'Voces que se resisten al silencio',
  colegio: 'Colegio Tom Adams IED',
  localidad: 'Localidad de Kennedy, Bogotá',
  correo: 'cedtomadams8@educacionbogota.edu.co',
  sitioColegio: 'https://colegiotomadams.edu.co',
  escudo: 'media/identidad/escudo-colegio',
  imagenPrincipal: 'media/museo/muestras-comunitarias-3',
})

export const QUE_ES = Object.freeze({
  queEs: [
    'Restauradores de la Memoria es un proyecto pedagógico del Colegio Tom Adams IED, en la localidad de Kennedy (Bogotá), que trabaja la memoria histórica del conflicto armado y de las violencias en Colombia desde el aula, el arte y el territorio.',
    'Su expresión más visible es el Museo Escolar de la Memoria, que los estudiantes construyen y presentan cada año desde 2021. Su antecedente es la exposición «Escuelas que recuerdan, narran y resignifican la guerra», presentada en la Feria del Libro de 2018.',
  ],
  proposito:
    'Que la comunidad educativa recuerde, narre y resignifique la historia reciente del país, reconozca a las víctimas y haga de la escuela un territorio de paz.',
  importancia: [
    'Conservar la memoria es reconocer a las víctimas y comprender lo que pasó para que no se repita. La Ley 1448 de 2011, Ley de Víctimas y Restitución de Tierras, establece el deber de memoria del Estado y crea el Centro Nacional de Memoria Histórica.',
    'En la escuela, la memoria institucional guarda además la historia de quienes construyen el colegio: sus estudiantes, docentes y familias. En 2026 los documentos del proyecto se incorporaron al Registro Especial de Archivos de Derechos Humanos y Memoria Histórica del CNMH.',
  ],
  cita: {
    texto: 'Quien no conoce su historia está condenado a repetirla.',
    fuente: 'Página web «Museo de la Memoria», alianza con la ETITC',
  },
  actividades: [
    {
      titulo: 'Museo Escolar de la Memoria',
      descripcion:
        'Cada año los estudiantes crean esculturas, maquetas, pinturas, objetos intervenidos, teatro y danza, y los presentan a la comunidad.',
      ruta: '/museo',
    },
    {
      titulo: 'Salidas pedagógicas',
      descripcion:
        'Recorridos por lugares de memoria de Bogotá: el Centro de Memoria, Paz y Reconciliación, el Eje de la Memoria y casas de memoria de los barrios.',
      ruta: '/salidas-pedagogicas',
    },
    {
      titulo: 'Fechas conmemorativas',
      descripcion:
        'Jornadas como el 9 de abril o el 25 de mayo, con performances de estudiantes que la presentación del proyecto llama «memorias corporales».',
      ruta: '/fechas-conmemorativas',
    },
    {
      titulo: 'Visitas y encuentros',
      descripcion:
        'Conversatorios con víctimas, organizaciones y testigos, como Madres de Falsos Positivos (MAFAPO) o el fotógrafo Jesús Abad Colorado.',
      ruta: '/visitas-y-eventos',
    },
    {
      titulo: 'Museo Virtual y medios',
      descripcion:
        'Recorridos en 3D y realidad virtual, entrevistas en radio y televisión, y publicaciones que llevan el proyecto más allá del colegio.',
      ruta: '/museo/virtual',
    },
  ],
  participantes: [
    {
      titulo: 'Estudiantes',
      descripcion:
        'Investigan, crean las piezas del museo y las presentan a la comunidad educativa y a los visitantes.',
    },
    {
      titulo: 'Docentes',
      descripcion:
        'Acompañan el proyecto desde el aula; entre ellas, Ángela Marcela Gutiérrez Veloza, docente de Ciencias Sociales.',
    },
    {
      titulo: 'Familias y comunidad',
      descripcion:
        'Vecinos, familias y organizaciones del entorno participan en las muestras comunitarias y en los Entornos Escolares Inspiradores.',
    },
    {
      titulo: 'Aliados institucionales',
      descripcion:
        'Entidades como el CNMH, el Museo Nacional, el CMPR, la SED y la ETITC acompañan, forman y reconocen el trabajo del proyecto.',
      ruta: '/alianzas',
    },
  ],
})

export const MUSEO = Object.freeze({
  presentacion: [
    'El Museo Escolar de la Memoria es la muestra que los estudiantes del Colegio Tom Adams IED crean y presentan cada año desde 2021. Reúne esculturas, pinturas, maquetas, fotografías, objetos intervenidos, teatro y danza sobre la memoria del conflicto armado.',
    'Algunas ediciones se han llamado «Arte y Memoria», y el museo también ha salido a la calle, a ferias y a espacios de la ciudad como el Centro de Memoria, Paz y Reconciliación.',
  ],
  creditos: [
    ['Piezas y montajes', 'Estudiantes del Colegio Tom Adams IED'],
    ['Fotografías', 'Archivo del proyecto Restauradores de la Memoria'],
    [
      'Modelos 3D',
      'Equipo del portal (piezas provisionales hasta la digitalización por fotogrametría)',
    ],
    ['Museo Virtual', 'Equipo del curso de Programación Web, con A-Frame'],
  ],
})
