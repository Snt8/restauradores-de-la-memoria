import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { PAGINAS } from '@/app/navegacion.js'
import { QUE_ES } from '@/content/sitio.js'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

const SECCIONES = [
  { id: 'que-es', etiqueta: 'Qué es' },
  { id: 'proposito', etiqueta: 'Propósito' },
  { id: 'importancia', etiqueta: '¿Por qué conservar la memoria?' },
  { id: 'actividades', etiqueta: 'Qué actividades desarrolla' },
  { id: 'participantes', etiqueta: 'Quiénes participan' },
  { id: 'formacion', etiqueta: 'Cualificación docente' },
]

const titulo = (id) => SECCIONES.find((seccion) => seccion.id === id).etiqueta

export function QueEsPage() {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="El proyecto"
          titulo={PAGINAS.queEs.etiqueta}
          descripcion={QUE_ES.queEs[0]}
          icono={PAGINAS.queEs.icono}
        />
      }
      panel={
        <>
          <InvitacionAlForo
            titulo="¿Tienes una pregunta?"
            texto="Escríbela en el foro: estudiantes, docentes y familias del proyecto pueden responderte."
            categoria="preguntas"
          />
          <EnEstaPagina secciones={SECCIONES} />
        </>
      }
    >
      <Seccion id="que-es" titulo={titulo('que-es')}>
        <div className="max-w-lectura space-y-4 text-lg leading-relaxed text-tinta-suave">
          {QUE_ES.queEs.slice(1).map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Seccion>

      <Seccion id="proposito" titulo={titulo('proposito')} className="border-l-4 border-l-memoria">
        <p className="max-w-lectura font-display text-2xl leading-snug sm:text-3xl">
          {QUE_ES.proposito}
        </p>
      </Seccion>

      <Seccion id="importancia" titulo={titulo('importancia')}>
        <div className="max-w-lectura space-y-4 text-lg leading-relaxed text-tinta-suave">
          {QUE_ES.importancia.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
        <figure className="mt-6 border-l-4 border-vela pl-5">
          <blockquote className="font-display text-xl sm:text-2xl">
            «{QUE_ES.cita.texto}»
          </blockquote>
          <figcaption className="mt-2 text-sm text-tinta-suave">{QUE_ES.cita.fuente}</figcaption>
        </figure>
      </Seccion>

      <Seccion id="actividades" titulo={titulo('actividades')} variante="abierta">
        <ul className="grid gap-4 sm:grid-cols-2">
          {QUE_ES.actividades.map((actividad) => (
            <li key={actividad.titulo}>
              <TarjetaEnlazada {...actividad} />
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion id="participantes" titulo={titulo('participantes')} variante="abierta">
        <ul className="grid gap-4 sm:grid-cols-2">
          {QUE_ES.participantes.map((participante) => (
            <li key={participante.titulo}>
              <TarjetaEnlazada {...participante} />
            </li>
          ))}
        </ul>
      </Seccion>

      <FormacionDocente />
    </PlantillaDePagina>
  )
}

function TarjetaEnlazada({ titulo: nombre, descripcion, ruta }) {
  return (
    <article className={`${CLASE_TARJETA} h-full p-5 sm:p-6`}>
      <h3 className="font-sans text-lg font-semibold">{nombre}</h3>
      <p className="mt-2 leading-relaxed text-tinta-suave">{descripcion}</p>
      {ruta && (
        <Link
          to={ruta}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-memoria hover:underline"
        >
          Ver más <span className="sr-only">sobre {nombre}</span>
          <Icono nombre="flecha-derecha" className="size-4" />
        </Link>
      )}
    </article>
  )
}

function FormacionDocente() {
  const consulta = useQuery(recursos.actividades.lista({ tipo: 'formacion' }))

  return (
    <Seccion
      id="formacion"
      titulo={titulo('formacion')}
      descripcion="Formación de los docentes del proyecto en memoria, verdad y educación para la paz."
      variante="abierta"
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos }) => (
          <ul className="space-y-4">
            {elementos.map((formacion) => (
              <li key={formacion.id}>
                <TarjetaDeContenido
                  titulo={formacion.nombre}
                  fecha={formacion.fecha}
                  descripcion={formacion.descripcion}
                  evidencias={formacion.evidencias}
                />
              </li>
            ))}
          </ul>
        )}
      </EstadoDeConsulta>
    </Seccion>
  )
}
