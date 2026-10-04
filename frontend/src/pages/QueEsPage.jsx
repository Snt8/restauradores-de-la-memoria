import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { PAGINAS } from '@/app/navegacion.js'
import { QUE_ES } from '@/content/sitio.js'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

export function QueEsPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="El proyecto"
        titulo={PAGINAS.queEs.etiqueta}
        entradilla={QUE_ES.queEs[0]}
      />

      <Seccion titulo="Qué es">
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-tinta-suave">
          {QUE_ES.queEs.slice(1).map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Propósito" className="bg-noche text-white [&_h2]:text-white">
        <p className="max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
          {QUE_ES.proposito}
        </p>
      </Seccion>

      <Seccion titulo="¿Por qué conservar la memoria?">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-lg leading-relaxed text-tinta-suave">
            {QUE_ES.importancia.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </div>
          <figure className="self-start border-l-4 border-vela pl-6">
            <blockquote className="font-display text-2xl">«{QUE_ES.cita.texto}»</blockquote>
            <figcaption className="mt-3 text-sm text-tinta-suave">{QUE_ES.cita.fuente}</figcaption>
          </figure>
        </div>
      </Seccion>

      <Seccion titulo="Qué actividades desarrolla" className="bg-papel-hondo">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUE_ES.actividades.map((actividad) => (
            <li key={actividad.titulo}>
              <TarjetaEnlazada {...actividad} />
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="Quiénes participan">
        <ul className="grid gap-4 md:grid-cols-2">
          {QUE_ES.participantes.map((participante) => (
            <li key={participante.titulo}>
              <TarjetaEnlazada {...participante} />
            </li>
          ))}
        </ul>
      </Seccion>

      <FormacionDocente />
    </>
  )
}

function TarjetaEnlazada({ titulo, descripcion, ruta }) {
  return (
    <article className="h-full rounded-tarjeta bg-white p-6 shadow-tarjeta">
      <h3 className="text-xl font-semibold">{titulo}</h3>
      <p className="mt-2 text-tinta-suave">{descripcion}</p>
      {ruta && (
        <Link
          to={ruta}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-memoria hover:underline"
        >
          Ver más <span className="sr-only">sobre {titulo}</span>
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
      titulo="Cualificación docente"
      descripcion="Formación de los docentes del proyecto en memoria, verdad y educación para la paz."
      className="bg-papel-hondo"
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos }) => (
          <ul className="grid gap-6 md:grid-cols-2">
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
