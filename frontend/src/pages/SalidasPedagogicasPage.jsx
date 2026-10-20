import { PAGINAS } from '@/app/navegacion.js'
import { useSalidasPorAnio } from '@/features/actividades/salidas.js'
import { IndiceDeAnios, SalidasPorAnio } from '@/features/actividades/SalidasPorAnio.jsx'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

export function SalidasPedagogicasPage() {
  const { consulta, grupos } = useSalidasPorAnio()

  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Actividades"
          titulo={PAGINAS.salidas.etiqueta}
          descripcion="Los estudiantes recorren lugares de memoria de Bogotá para escuchar a quienes vivieron el conflicto y conocer cómo la ciudad recuerda. Cada salida incluye su lugar, fecha y fotografías."
          icono={PAGINAS.salidas.icono}
          tono="vela"
        />
      }
      panel={
        <>
          <InvitacionAlForo
            titulo="¿Fuiste a alguna salida?"
            texto="Cuenta en el foro qué aprendiste o qué te impactó del recorrido."
            categoria="salidas"
          />
          {grupos.length > 0 && <IndiceDeAnios grupos={grupos} />}
        </>
      }
    >
      <EstadoDeConsulta consulta={consulta}>
        {() => <SalidasPorAnio grupos={grupos} />}
      </EstadoDeConsulta>
    </PlantillaDePagina>
  )
}
