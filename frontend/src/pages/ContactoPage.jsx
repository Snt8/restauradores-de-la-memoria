import { PAGINAS } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { FormularioVisitante } from '@/features/visitantes/FormularioVisitante.jsx'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'

export function ContactoPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Contacto"
        titulo={PAGINAS.contacto.etiqueta}
        entradilla="¿Quieres visitar el museo, proponer una alianza o compartir una historia? Escríbenos."
      />
      <Contenedor className="grid gap-10 py-12 lg:grid-cols-[1fr_2fr]">
        <aside aria-labelledby="titulo-informacion" className="space-y-6">
          <h2 id="titulo-informacion" className="text-2xl font-semibold">
            Información institucional
          </h2>
          <dl className="space-y-4">
            <Dato etiqueta="Institución">{PROYECTO.colegio}</Dato>
            <Dato etiqueta="Ubicación">{PROYECTO.localidad}</Dato>
            <Dato etiqueta="Correo">
              <a
                href={`mailto:${PROYECTO.correo}`}
                className="inline-flex items-center gap-2 break-all text-memoria hover:underline"
              >
                <Icono nombre="correo" className="size-4 shrink-0" />
                {PROYECTO.correo}
              </a>
            </Dato>
            <Dato etiqueta="Página del colegio">
              <a
                href={PROYECTO.sitioColegio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-memoria hover:underline"
              >
                colegiotomadams.edu.co
                <Icono nombre="enlace-externo" className="size-4" />
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </a>
            </Dato>
          </dl>
        </aside>

        <section
          aria-labelledby="titulo-formulario"
          className="rounded-tarjeta bg-white p-6 shadow-tarjeta sm:p-8"
        >
          <h2 id="titulo-formulario" className="mb-6 text-2xl font-semibold">
            Formulario de contacto
          </h2>
          <FormularioVisitante origen="contacto" />
        </section>
      </Contenedor>
    </>
  )
}

function Dato({ etiqueta, children }) {
  return (
    <div>
      <dt className="text-sm font-semibold tracking-wide text-tinta-suave uppercase">{etiqueta}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}
