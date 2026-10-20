import { PAGINAS } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { FormularioVisitante } from '@/features/visitantes/FormularioVisitante.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'

export function ContactoPage() {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="El proyecto"
          titulo={PAGINAS.contacto.etiqueta}
          descripcion="¿Quieres visitar el museo, proponer una alianza o compartir una historia? Escríbenos."
          icono={PAGINAS.contacto.icono}
        />
      }
      panel={
        <>
          <TarjetaPanel titulo="Información institucional" destacada>
            <dl className="divide-y divide-linea text-sm">
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
          </TarjetaPanel>
          <InvitacionAlForo
            titulo="¿Prefieres preguntar en público?"
            texto="En el foro, otras personas de la comunidad también pueden responderte."
            categoria="preguntas"
          />
        </>
      }
    >
      <Seccion
        titulo="Formulario de contacto"
        descripcion="Te responderemos al correo que indiques. Los campos con * son obligatorios."
      >
        <FormularioVisitante origen="contacto" />
      </Seccion>
    </PlantillaDePagina>
  )
}

function Dato({ etiqueta, children }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <dt className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">
        {etiqueta}
      </dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}
