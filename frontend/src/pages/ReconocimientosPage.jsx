import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

const idDe = (reconocimiento) => `reconocimiento-${reconocimiento.slug}`

export function ReconocimientosPage() {
  const consulta = useQuery(recursos.reconocimientos.lista())
  const elementos = consulta.data?.elementos ?? []

  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="El proyecto"
          titulo={PAGINAS.reconocimientos.etiqueta}
          descripcion="Premios, menciones y registros que distintas entidades han otorgado al proyecto y a sus participantes."
          icono={PAGINAS.reconocimientos.icono}
          tono="vela"
        />
      }
      panel={
        elementos.length > 0 && (
          <EnEstaPagina
            titulo={
              elementos.length === 1 ? '1 reconocimiento' : `${elementos.length} reconocimientos`
            }
            secciones={elementos.map((reconocimiento) => ({
              id: idDe(reconocimiento),
              etiqueta: reconocimiento.nombre,
              detalle: reconocimiento.fecha.anio ?? undefined,
            }))}
          />
        )
      }
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos: reconocimientos }) => (
          <ol className="space-y-4">
            {reconocimientos.map((reconocimiento) => (
              <li key={reconocimiento.id}>
                <TarjetaDeContenido
                  id={idDe(reconocimiento)}
                  titulo={reconocimiento.nombre}
                  fecha={reconocimiento.fecha}
                  descripcion={reconocimiento.descripcion}
                  evidencias={reconocimiento.evidencias}
                >
                  {reconocimiento.otorgante && (
                    <p className="text-sm">
                      <span className="font-semibold">Otorgado por:</span>{' '}
                      {reconocimiento.otorgante}
                    </p>
                  )}
                </TarjetaDeContenido>
              </li>
            ))}
          </ol>
        )}
      </EstadoDeConsulta>
    </PlantillaDePagina>
  )
}
