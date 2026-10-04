import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { cargarAframe } from '@/features/museo-virtual/aframe.js'
import { MuseoInteractivo } from '@/features/museo-virtual/MuseoInteractivo.jsx'
import { FormularioVisitante } from '@/features/visitantes/FormularioVisitante.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

const INSTRUCCIONES = [
  ['Mirar', 'Arrastra con el mouse o el dedo.'],
  ['Caminar', 'Teclas W A S D o flechas.'],
  ['Conocer una pieza', 'Haz clic en el objeto o en su pedestal.'],
  ['Ver una fotografía', 'Haz clic en el cuadro.'],
  ['Realidad virtual', 'Usa el botón de gafas (si tu dispositivo lo permite).'],
]

/**
 * Museo Virtual de la Memoria. Esta página se carga solo cuando el visitante entra
 * (ruta diferida) y A-Frame se descarga en paralelo con los datos de la sala.
 */
export function MuseoVirtualPage() {
  const objetos = useQuery(recursos.objetos.lista())
  const exposiciones = useQuery(recursos.exposiciones.lista())
  const motor = useQuery({
    queryKey: ['aframe'],
    queryFn: () => cargarAframe(),
    staleTime: Infinity,
  })

  // Las tres cargas se presentan como una sola: la sala necesita todas.
  const sala = combinar(objetos, exposiciones, motor)

  return (
    <>
      <EncabezadoDePagina
        antetitulo="Museo"
        titulo={PAGINAS.museoVirtual.etiqueta}
        entradilla="Recorre una sala del Museo Escolar de la Memoria: acércate a cada objeto, consulta su historia y mira en los muros las fotografías de las ediciones del museo."
      >
        <dl className="mt-8 grid max-w-4xl gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {INSTRUCCIONES.map(([accion, como]) => (
            <div key={accion}>
              <dt className="font-semibold">{accion}</dt>
              <dd className="text-tinta-suave">{como}</dd>
            </div>
          ))}
        </dl>
      </EncabezadoDePagina>

      <Contenedor className="py-10">
        <EstadoDeConsulta
          consulta={sala}
          esVacio={([listaDeObjetos]) => listaDeObjetos.elementos.length === 0}
          vacio="La sala todavía no tiene objetos publicados."
          cargando={
            <div
              role="status"
              className="flex h-[70dvh] min-h-96 items-center justify-center rounded-tarjeta bg-noche text-white/80"
            >
              Preparando la sala del museo…
            </div>
          }
        >
          {([listaDeObjetos, listaDeExposiciones]) => (
            <MuseoInteractivo
              objetos={listaDeObjetos.elementos}
              exposiciones={listaDeExposiciones.elementos}
            />
          )}
        </EstadoDeConsulta>
      </Contenedor>

      <Seccion
        titulo="Libro de visitas"
        descripcion="¿Recorriste el museo? Déjanos tu firma y, si quieres, un mensaje para el equipo de Restauradores de la Memoria."
        className="bg-papel-hondo"
      >
        <div className="max-w-3xl rounded-tarjeta bg-white p-6 shadow-tarjeta sm:p-8">
          <FormularioVisitante origen="libro_visitas" />
        </div>
      </Seccion>
    </>
  )
}

function combinar(...consultas) {
  const fallida = consultas.find((consulta) => consulta.isError)
  return {
    isPending: consultas.some((consulta) => consulta.isPending),
    isError: Boolean(fallida),
    error: fallida?.error,
    data: consultas.map((consulta) => consulta.data),
    refetch: () => consultas.filter((c) => c.isError).forEach((c) => c.refetch()),
  }
}
