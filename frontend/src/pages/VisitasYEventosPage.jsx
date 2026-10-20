import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { EventosFiltrables } from '@/features/eventos/EventosFiltrables.jsx'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Etiqueta } from '@/shared/ui/Etiqueta.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'

const TIPOS = [
  ['memoria', 'Visita', 'Víctimas, organizaciones y testigos que llegan al colegio.'],
  ['vela', 'Evento', 'Encuentros en el colegio y en la ciudad.'],
  ['rosa', 'Medios', 'Entrevistas en radio, televisión y prensa.'],
]

export function VisitasYEventosPage() {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Actividades"
          titulo={PAGINAS.eventos.etiqueta}
          descripcion="Visitas de víctimas, organizaciones y testigos; eventos en el colegio y en la ciudad; y las entrevistas en radio y televisión donde el proyecto ha contado su historia."
          icono={PAGINAS.eventos.icono}
          tono="vela"
        />
      }
      panel={
        <>
          <TarjetaPanel titulo="Qué encontrarás" destacada>
            <dl className="space-y-3 text-sm">
              {TIPOS.map(([tono, nombre, descripcion]) => (
                <div key={nombre}>
                  <dt>
                    <Etiqueta tono={tono}>{nombre}</Etiqueta>
                  </dt>
                  <dd className="mt-1 leading-relaxed text-tinta-suave">{descripcion}</dd>
                </div>
              ))}
            </dl>
            <EnlaceBoton
              hacia={`${RUTAS.galeria}?seccion=eventos`}
              variante="secundario"
              icono="imagen"
              className="w-full justify-center"
            >
              Fotos de los eventos
            </EnlaceBoton>
          </TarjetaPanel>
          <InvitacionAlForo
            titulo="¿Estuviste en alguno?"
            texto="Comparte tu recuerdo del encuentro en el foro."
            categoria="historias"
          />
        </>
      }
    >
      <EventosFiltrables />
    </PlantillaDePagina>
  )
}
