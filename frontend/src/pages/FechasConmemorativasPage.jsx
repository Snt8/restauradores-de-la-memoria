import { PAGINAS } from '@/app/navegacion.js'
import { CalendarioConmemorativo } from '@/features/actividades/CalendarioConmemorativo.jsx'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'

export function FechasConmemorativasPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Actividades"
        titulo={PAGINAS.fechas.etiqueta}
        entradilla="Fechas que el colegio recuerda cada año con performances, carteles e intervenciones de los estudiantes, en el orden del calendario."
      />
      <Contenedor className="py-12">
        <CalendarioConmemorativo />
      </Contenedor>
    </>
  )
}
