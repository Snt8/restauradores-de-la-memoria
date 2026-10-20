import { PAGINAS } from '@/app/navegacion.js'
import {
  CalendarioConmemorativo,
  PanelDelCalendario,
} from '@/features/actividades/CalendarioConmemorativo.jsx'
import { useConmemoraciones } from '@/features/actividades/conmemoraciones.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

export function FechasConmemorativasPage() {
  const consulta = useConmemoraciones()
  const conmemoraciones = consulta.data?.elementos ?? []

  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Actividades"
          titulo={PAGINAS.fechas.etiqueta}
          descripcion="Fechas que el colegio recuerda cada año con performances, carteles e intervenciones de los estudiantes, en el orden del calendario."
          icono={PAGINAS.fechas.icono}
          tono="rosa"
        />
      }
      panel={conmemoraciones.length > 0 && <PanelDelCalendario conmemoraciones={conmemoraciones} />}
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos }) => <CalendarioConmemorativo conmemoraciones={elementos} />}
      </EstadoDeConsulta>
    </PlantillaDePagina>
  )
}
