import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { foro } from '@/shared/api/foro.js'
import { idDeVotante } from './identidad.js'

/**
 * Voto de una publicación o comentario con respuesta inmediata (optimista): la interfaz
 * cambia al hacer clic y, si la API falla, vuelve al estado anterior. Votar dos veces la
 * misma flecha retira el voto, como en Reddit.
 *
 * @param objetivo 'publicacion' | 'comentario'
 */
export function useVoto({ objetivo, id, puntaje, miVoto }) {
  const queryClient = useQueryClient()
  // Mientras nadie vote, manda lo que trae la API; después, lo que confirmó el último voto.
  const [propio, setPropio] = useState(null)
  const estado = propio ?? { puntaje, miVoto }

  const mutacion = useMutation({
    mutationFn: (valor) => foro.votar({ objetivo, id, votante: idDeVotante(), valor }),
    onSuccess: (confirmado) => {
      setPropio({ puntaje: confirmado.puntaje, miVoto: confirmado.mi_voto })
      // Las listas quedan desactualizadas pero no se recargan ya: reordenar el muro
      // mientras alguien vota sería desconcertante. Se refrescan al volver a visitarlas.
      queryClient.invalidateQueries({ queryKey: foro.raiz, refetchType: 'none' })
    },
  })

  function votar(valor) {
    const nuevo = estado.miVoto === valor ? 0 : valor
    const anterior = estado
    setPropio({ puntaje: estado.puntaje - estado.miVoto + nuevo, miVoto: nuevo })
    mutacion.mutate(nuevo, { onError: () => setPropio(anterior) })
  }

  return { ...estado, votar, fallo: mutacion.isError }
}
