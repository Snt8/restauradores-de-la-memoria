import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { ACCESOS_PRINCIPALES, RUTAS } from '@/app/navegacion.js'
import { PROYECTO, QUE_ES } from '@/content/sitio.js'
import { Fecha } from '@/entities/contenido/Fecha.jsx'
import { Exposiciones } from '@/features/museo/Exposiciones.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

export function InicioPage() {
  return (
    <>
      <title>{`${PROYECTO.nombre} · ${PROYECTO.colegio}`}</title>
      <Portada />

      <Seccion titulo="Un proyecto para no olvidar">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-lg leading-relaxed text-tinta-suave">
            {QUE_ES.queEs.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
            <EnlaceBoton hacia={RUTAS.queEs} variante="secundario" icono="flecha-derecha">
              Conocer el proyecto
            </EnlaceBoton>
          </div>
          <figure className="self-start rounded-tarjeta bg-noche p-8 text-white">
            <blockquote className="font-display text-2xl leading-snug">
              «{QUE_ES.cita.texto}»
            </blockquote>
            <figcaption className="mt-4 text-sm text-white/60">{QUE_ES.cita.fuente}</figcaption>
          </figure>
        </div>
      </Seccion>

      <Seccion titulo="Explora el portal" className="bg-papel-hondo">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACCESOS_PRINCIPALES.map((pagina) => (
            <li key={pagina.ruta}>
              <Link
                to={pagina.ruta}
                className="group flex h-full flex-col justify-between gap-4 rounded-tarjeta bg-white p-6 shadow-tarjeta hover:ring-2 hover:ring-memoria"
              >
                <span>
                  <span className="block font-display text-xl font-semibold group-hover:text-memoria">
                    {pagina.etiqueta}
                  </span>
                  <span className="mt-2 block text-sm text-tinta-suave">{pagina.descripcion}</span>
                </span>
                <Icono nombre="flecha-derecha" className="size-5 text-memoria" />
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion
        titulo="Exposiciones recientes"
        descripcion="Ediciones del Museo Escolar de la Memoria y exposiciones en otros espacios."
        accion={
          <EnlaceBoton hacia={RUTAS.museo} variante="secundario" icono="flecha-derecha">
            Ver todas
          </EnlaceBoton>
        }
      >
        <Exposiciones limite={2} />
      </Seccion>

      <ReconocimientosRecientes />
    </>
  )
}

function Portada() {
  return (
    <section aria-labelledby="titulo-portada" className="relative isolate overflow-hidden bg-noche">
      <ImagenResponsiva
        url={PROYECTO.imagenPrincipal}
        alt=""
        carga="eager"
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover opacity-45"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noche via-noche/80 to-noche/20" />
      <Contenedor className="py-24 text-white sm:py-32">
        <p className="mb-4 text-sm font-semibold tracking-widest text-vela uppercase">
          {PROYECTO.colegio} · {PROYECTO.localidad}
        </p>
        <h1 id="titulo-portada" className="max-w-3xl text-5xl font-semibold sm:text-7xl">
          {PROYECTO.nombre}
        </h1>
        <p className="mt-6 max-w-xl font-display text-2xl text-white/90 italic">
          «{PROYECTO.lema}»
        </p>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          El portal del Museo Escolar de la Memoria: objetos, fotografías, voces y evidencias de un
          colegio que decidió no olvidar.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <EnlaceBoton hacia={RUTAS.museoVirtual} variante="claro" icono="cubo">
            Recorrer el Museo Virtual
          </EnlaceBoton>
          <EnlaceBoton hacia={RUTAS.museo} variante="secundario" icono="flecha-derecha">
            Museo Escolar de la Memoria
          </EnlaceBoton>
        </div>
      </Contenedor>
    </section>
  )
}

function ReconocimientosRecientes() {
  const consulta = useQuery(recursos.reconocimientos.lista())

  return (
    <Seccion
      titulo="Reconocimientos recientes"
      className="bg-noche text-white [&_h2]:text-white"
      accion={
        <EnlaceBoton hacia={RUTAS.reconocimientos} variante="claro" icono="flecha-derecha">
          Ver todos
        </EnlaceBoton>
      }
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos }) => (
          <ul className="grid gap-6 md:grid-cols-3">
            {elementos.slice(0, 3).map((reconocimiento) => (
              <li key={reconocimiento.id} className="border-l-2 border-vela pl-5">
                <p className="text-sm text-vela">
                  <Fecha fecha={reconocimiento.fecha} />
                </p>
                <h3 className="mt-1 text-xl font-semibold">{reconocimiento.nombre}</h3>
                {reconocimiento.otorgante && (
                  <p className="mt-2 text-sm text-white/70">{reconocimiento.otorgante}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </EstadoDeConsulta>
    </Seccion>
  )
}
