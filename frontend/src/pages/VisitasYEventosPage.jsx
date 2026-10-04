import { PAGINAS } from '@/app/navegacion.js'
import { EventosFiltrables } from '@/features/eventos/EventosFiltrables.jsx'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'

export function VisitasYEventosPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Actividades"
        titulo={PAGINAS.eventos.etiqueta}
        entradilla="Visitas de víctimas, organizaciones y testigos; eventos en el colegio y en la ciudad; y las entrevistas en radio y televisión donde el proyecto ha contado su historia."
      />
      <Contenedor className="py-12">
        <EventosFiltrables />
      </Contenedor>
    </>
  )
}
