import { useSearchParams } from 'react-router'
import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR, CATEGORIAS_FORO, FORO, ORDENES_FORO } from '@/content/foro.js'
import { PROYECTO } from '@/content/sitio.js'
import { AtajoParaPublicar } from '@/features/foro/AtajoParaPublicar.jsx'
import { CategoriasDelForo } from '@/features/foro/CategoriasDelForo.jsx'
import { MuroDelForo } from '@/features/foro/MuroDelForo.jsx'
import { PanelDelForo } from '@/features/foro/PanelDelForo.jsx'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { useFiltroEnUrl } from '@/shared/lib/useFiltroEnUrl.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { FiltroDeOpciones } from '@/shared/ui/FiltroDeOpciones.jsx'

const VALORES_DE_CATEGORIA = CATEGORIAS_FORO.map((categoria) => categoria.valor)
const VALORES_DE_ORDEN = ORDENES_FORO.map((orden) => orden.valor).filter(Boolean)

/**
 * Foro de la comunidad con la distribución de Reddit: categorías a la izquierda, el muro
 * en el centro y la información del foro a la derecha. En pantallas pequeñas las tres
 * columnas se apilan y las categorías pasan a ser una fila deslizable.
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
    <div className="bg-fondo-foro">
      <title>{`${PAGINAS.foro.etiqueta} · ${PROYECTO.nombre}`}</title>
      <PortadaDelForo />

      <Contenedor
        ancho="amplio"
        className="grid grid-cols-[minmax(0,1fr)] gap-6 py-8 sm:py-10 lg:grid-cols-[13rem_minmax(0,1fr)_19rem] lg:gap-8 xl:grid-cols-[15rem_minmax(0,1fr)_20rem]"
      >
        <CategoriasDelForo actual={categoria} enlaceDe={enlaceDe} />

        <section aria-labelledby="titulo-muro" className="min-w-0 space-y-5">
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

        <PanelDelForo />
      </Contenedor>
    </div>
  )
}

function PortadaDelForo() {
  return (
    <header className="border-b border-linea bg-papel">
      <div
        aria-hidden="true"
        className="h-20 bg-noche bg-[radial-gradient(circle_at_15%_120%,var(--color-memoria)_0,transparent_45%),radial-gradient(circle_at_85%_-20%,var(--color-rosa)_0,transparent_40%)] sm:h-28"
      />
      <Contenedor
        ancho="amplio"
        className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8"
      >
        <div className="flex items-end gap-4">
          <span className="-mt-8 grid size-20 shrink-0 place-items-center rounded-full border-4 border-papel bg-white shadow-tarjeta sm:-mt-10 sm:size-24">
            <img
              src={miniaturaDeImagen(PROYECTO.escudo)}
              alt=""
              width="56"
              height="52"
              className="size-12 object-contain sm:size-14"
            />
          </span>
          <div className="min-w-0 pb-1">
            <p className="text-sm font-semibold tracking-widest text-memoria uppercase">
              Comunidad
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{PAGINAS.foro.etiqueta}</h1>
          </div>
        </div>
        <EnlaceBoton
          hacia={RUTAS.nuevaPublicacionForo}
          icono="mas"
          className="self-start sm:self-auto"
        >
          Crear publicación
        </EnlaceBoton>
      </Contenedor>
      <Contenedor ancho="amplio" className="pb-6 sm:pb-8">
        <p className="max-w-lectura text-lg leading-relaxed text-tinta-suave">
          {FORO.presentacion}
        </p>
      </Contenedor>
    </header>
  )
}
