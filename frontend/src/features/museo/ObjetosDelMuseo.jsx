import { useQuery } from '@tanstack/react-query'
import { recursos } from '@/shared/api/recursos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { TarjetaDeObjeto } from './TarjetaDeObjeto.jsx'

export function ObjetosDelMuseo() {
  const consulta = useQuery(recursos.objetos.lista())

  return (
    <EstadoDeConsulta consulta={consulta} vacio="Pronto publicaremos los objetos del museo.">
      {({ elementos }) => (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {elementos.map((objeto) => (
            <li key={objeto.id}>
              <TarjetaDeObjeto objeto={objeto} />
            </li>
          ))}
        </ul>
      )}
    </EstadoDeConsulta>
  )
}
