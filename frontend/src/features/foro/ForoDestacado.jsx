import { useQuery } from '@tanstack/react-query'
import { RUTAS } from '@/app/navegacion.js'
import { foro } from '@/shared/api/foro.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { idDeVotante } from './identidad.js'
import { TarjetaDePublicacion } from './TarjetaDePublicacion.jsx'

/**
 * Las conversaciones más activas del foro, para la página de inicio. Son publicaciones
 * completas (con votos y comentarios), así se puede participar sin salir de la portada.
 */
export function ForoDestacado() {
  const consulta = useQuery(foro.destacadas({ limite: 3, votante: idDeVotante() }))

  return (
    <EstadoDeConsulta
      consulta={consulta}
      vacio="Aún no hay conversaciones. ¡Abre la primera desde el foro!"
    >
      {({ elementos }) => (
        <ol className="space-y-4">
          {elementos.map((publicacion) => (
            <li key={publicacion.id}>
              <TarjetaDePublicacion publicacion={publicacion} />
            </li>
          ))}
        </ol>
      )}
    </EstadoDeConsulta>
  )
}

export function AccesoAlForo() {
  return (
    <EnlaceBoton hacia={RUTAS.foro} variante="secundario" icono="flecha-derecha">
      Ir al foro
    </EnlaceBoton>
  )
}
