import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'

export function ReconocimientosPage() {
  const consulta = useQuery(recursos.reconocimientos.lista())

  return (
    <>
      <EncabezadoDePagina
        antetitulo="Trayectoria"
        titulo={PAGINAS.reconocimientos.etiqueta}
        entradilla="Premios, menciones y registros que distintas entidades han otorgado al proyecto y a sus participantes."
      />
      <Contenedor className="py-12">
        <EstadoDeConsulta consulta={consulta}>
          {({ elementos }) => (
            <ol className="grid gap-6 md:grid-cols-2">
              {elementos.map((reconocimiento) => (
                <li key={reconocimiento.id}>
                  <TarjetaDeContenido
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
      </Contenedor>
    </>
  )
}
