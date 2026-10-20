import { useSearchParams } from 'react-router'
import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR, CATEGORIAS_FORO, ORDENES_FORO } from '@/content/foro.js'
import { PROYECTO } from '@/content/sitio.js'
import { AtajoParaPublicar } from '@/features/foro/AtajoParaPublicar.jsx'
import { CategoriasDelForo } from '@/features/foro/CategoriasDelForo.jsx'
import { MuroDelForo } from '@/features/foro/MuroDelForo.jsx'
import { PanelDelForo } from '@/features/foro/PanelDelForo.jsx'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { useFiltroEnUrl } from '@/shared/lib/useFiltroEnUrl.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { FiltroDeOpciones } from '@/shared/ui/FiltroDeOpciones.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

const VALORES_DE_CATEGORIA = CATEGORIAS_FORO.map((categoria) => categoria.valor)
const VALORES_DE_ORDEN = ORDENES_FORO.map((orden) => orden.valor).filter(Boolean)

/**
 * Foro de la comunidad: portada, categorías y orden sobre el muro, y la información del
 * foro en el panel derecho. Categoría y orden viven en la URL.
 */
export function ForoPage() {
  const [parametros] = useSearchParams()
  const [categoria] = useFiltroEnUrl('categoria', VALORES_DE_CATEGORIA)
  const [orden, cambiarOrden] = useFiltroEnUrl('orden', VALORES_DE_ORDEN)

  function enlaceDe(nueva) {
    const siguientes = new URLSearchParams(parametros)
    if (nueva) siguientes.set('categoria', nueva)
    else siguientes.delete('categoria')
    const consulta = siguientes.toString()
    return consulta ? `${RUTAS.foro}?${consulta}` : RUTAS.foro
  }

  return (
    <PlantillaDePagina
      etiquetaDelPanel="Sobre el foro"
      portada={
        <PortadaDePagina
          antetitulo="Comunidad"
          titulo={PAGINAS.foro.etiqueta}
          descripcion={PAGINAS.foro.descripcion}
          escudo={miniaturaDeImagen(PROYECTO.escudo)}
          acciones={
            <EnlaceBoton hacia={RUTAS.nuevaPublicacionForo} icono="mas">
              Crear publicación
            </EnlaceBoton>
          }
        />
      }
      panel={<PanelDelForo conBotonPublicar={false} />}
    >
      <CategoriasDelForo actual={categoria} enlaceDe={enlaceDe} />
      <section aria-labelledby="titulo-muro" className="space-y-5">
        <h2 id="titulo-muro" className="sr-only">
          {categoria
            ? `Publicaciones de ${CATEGORIA_POR_VALOR[categoria].etiqueta}`
            : 'Publicaciones'}
        </h2>
        <AtajoParaPublicar categoria={categoria} />
        <FiltroDeOpciones
          etiqueta="Ordenar publicaciones"
          opciones={ORDENES_FORO}
          valor={orden}
          onCambiar={cambiarOrden}
        />
        <MuroDelForo categoria={categoria} orden={orden} />
      </section>
    </PlantillaDePagina>
  )
}
