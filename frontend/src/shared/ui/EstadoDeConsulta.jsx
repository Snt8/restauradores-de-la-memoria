import { Esqueleto } from './Esqueleto.jsx'

/**
 * Resuelve los tres estados de cualquier consulta (cargando, error y vacío) para que
 * cada sección solo describa qué mostrar cuando hay datos.
 *
 * @param consulta   resultado de useQuery
 * @param esVacio    decide si los datos cuentan como vacíos (por defecto, página sin elementos)
 * @param vacio      mensaje cuando no hay contenido
 * @param children   función (datos) => JSX
 */
export function EstadoDeConsulta({
  consulta,
  esVacio = (datos) => Array.isArray(datos?.elementos) && datos.elementos.length === 0,
  vacio = 'Todavía no hay contenido publicado en esta sección.',
  cargando = <Esqueleto />,
  children,
}) {
  if (consulta.isPending) return cargando

  if (consulta.isError) {
    return (
      <div role="alert" className="rounded-tarjeta border border-rosa/30 bg-rosa/5 p-6">
        <p className="font-semibold">No pudimos cargar este contenido.</p>
        <p className="mt-1 text-sm text-tinta-suave">
          {consulta.error?.status === 0
            ? 'Revisa tu conexión a internet e inténtalo de nuevo.'
            : 'Ocurrió un problema en el servidor. Inténtalo de nuevo en unos minutos.'}
        </p>
        <button
          type="button"
          onClick={() => consulta.refetch()}
          className="mt-4 rounded-full border border-tinta/25 px-4 py-1.5 text-sm font-semibold hover:border-memoria hover:text-memoria"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (esVacio(consulta.data)) {
    return <p className="rounded-tarjeta bg-papel-hondo p-6 text-tinta-suave">{vacio}</p>
  }

  return children(consulta.data)
}
