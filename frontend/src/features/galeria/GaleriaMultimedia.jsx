import { useInfiniteQuery } from '@tanstack/react-query'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { useFiltroEnUrl } from '@/shared/lib/useFiltroEnUrl.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { FiltroDeOpciones } from '@/shared/ui/FiltroDeOpciones.jsx'

const SECCIONES = Object.freeze({
  museo: 'Museo',
  salidas: 'Salidas pedagógicas',
  conmemoraciones: 'Fechas conmemorativas',
  eventos: 'Visitas y eventos',
  reconocimientos: 'Reconocimientos',
  alianzas: 'Alianzas',
  formacion: 'Formación',
  archivo: 'Archivo del proyecto',
})

const TIPOS = Object.freeze({ foto: 'Fotografías', video: 'Videos', audio: 'Audios' })

const conTodos = (catalogo) => [
  { valor: null, etiqueta: 'Todo' },
  ...Object.entries(catalogo).map(([valor, etiqueta]) => ({ valor, etiqueta })),
]

const POR_PAGINA = 24

/** Galería con filtros por sección y por tipo de medio, y carga progresiva. */
export function GaleriaMultimedia() {
  const [seccion, cambiarSeccion] = useFiltroEnUrl('seccion', Object.keys(SECCIONES))
  const [tipo, cambiarTipo] = useFiltroEnUrl('tipo', Object.keys(TIPOS))
  const filtros = Object.fromEntries(
    Object.entries({ seccion, tipo }).filter(([, valor]) => valor !== null),
  )
  const consulta = useInfiniteQuery(recursos.galeria.listaInfinita(filtros, POR_PAGINA))

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <FiltroDeOpciones
          etiqueta="Filtrar por sección"
          opciones={conTodos(SECCIONES)}
          valor={seccion}
          onCambiar={cambiarSeccion}
        />
        <FiltroDeOpciones
          etiqueta="Filtrar por tipo de medio"
          opciones={conTodos(TIPOS)}
          valor={tipo}
          onCambiar={cambiarTipo}
        />
      </div>

      <EstadoDeConsulta
        consulta={consulta}
        esVacio={(datos) => datos.pages[0].total === 0}
        vacio="No hay evidencias con estos filtros."
      >
        {(datos) => {
          const elementos = datos.pages.flatMap((pagina) => pagina.elementos)
          const contextoPorId = new Map(elementos.map((e) => [e.evidencia.id, e]))
          return (
            <>
              <p aria-live="polite" className="text-sm text-tinta-suave">
                Mostrando {elementos.length} de {datos.pages[0].total} evidencias
              </p>
              <GaleriaDeEvidencias
                densidad="amplia"
                evidencias={elementos.map((e) => e.evidencia)}
                detalleDe={(evidencia) => {
                  const { seccion: suya, contexto } = contextoPorId.get(evidencia.id)
                  return contexto ?? SECCIONES[suya]
                }}
              />
              {consulta.hasNextPage && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => consulta.fetchNextPage()}
                    disabled={consulta.isFetchingNextPage}
                    className="rounded-full bg-memoria px-6 py-2.5 text-sm font-semibold text-white hover:bg-memoria-hondo disabled:opacity-60"
                  >
                    {consulta.isFetchingNextPage ? 'Cargando…' : 'Cargar más evidencias'}
                  </button>
                </div>
              )}
            </>
          )
        }}
      </EstadoDeConsulta>
    </div>
  )
}
