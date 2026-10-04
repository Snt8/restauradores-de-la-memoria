import { PAGINAS } from '@/app/navegacion.js'
import { SalidasPorAnio } from '@/features/actividades/SalidasPorAnio.jsx'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'

export function SalidasPedagogicasPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Actividades"
        titulo={PAGINAS.salidas.etiqueta}
        entradilla="Los estudiantes recorren lugares de memoria de Bogotá para escuchar a quienes vivieron el conflicto y conocer cómo la ciudad recuerda. Cada salida incluye su lugar, fecha y fotografías."
      />
      <Contenedor className="py-12">
        <SalidasPorAnio />
      </Contenedor>
    </>
  )
}
