import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { cargarAframe } from '@/features/museo-virtual/aframe.js'
import { MuseoInteractivo } from '@/features/museo-virtual/MuseoInteractivo.jsx'
import { FormularioVisitante } from '@/features/visitantes/FormularioVisitante.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
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
 * (ruta diferida) y A-Frame se descarga en paralelo con los datos de la sala. No tiene
 * panel derecho: la sala 3D aprovecha todo el ancho disponible.
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
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Museo"
          titulo={PAGINAS.museoVirtual.etiqueta}
          descripcion="Recorre una sala del Museo Escolar de la Memoria: acércate a cada objeto, consulta su historia y mira en los muros las fotografías de las ediciones del museo."
          icono={PAGINAS.museoVirtual.icono}
          tono="cielo"
          migas={[{ etiqueta: PAGINAS.museo.corta, ruta: PAGINAS.museo.ruta }]}
        >
          <details className="group mt-6 rounded-lg border border-linea bg-papel/60 open:bg-papel">
            <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
              Cómo recorrer la sala
              <Icono
                nombre="chevron-abajo"
                className="size-5 transition-transform group-open:rotate-180"
              />
            </summary>
            <dl className="grid gap-x-6 gap-y-3 px-4 pb-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {INSTRUCCIONES.map(([accion, como]) => (
                <div key={accion}>
                  <dt className="font-semibold">{accion}</dt>
                  <dd className="text-tinta-suave">{como}</dd>
                </div>
              ))}
            </dl>
          </details>
        </PortadaDePagina>
      }
    >
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

      <Seccion
        titulo="Libro de visitas"
        descripcion="¿Recorriste el museo? Déjanos tu firma y, si quieres, un mensaje para el equipo de Restauradores de la Memoria."
      >
        <div className="max-w-3xl">
          <FormularioVisitante origen="libro_visitas" />
        </div>
      </Seccion>
    </PlantillaDePagina>
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
