import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { armarHilo, ORDENES_DE_COMENTARIOS } from '@/features/foro/arbol.js'
import { BotonCompartir } from '@/features/foro/BotonCompartir.jsx'
import { ControlDeVoto } from '@/features/foro/ControlDeVoto.jsx'
import { CLASE_TARJETA_FORO, textoDeComentarios } from '@/features/foro/estilos.js'
import { FormularioComentario } from '@/features/foro/FormularioComentario.jsx'
import { HiloDeComentarios } from '@/features/foro/HiloDeComentarios.jsx'
import { idDeVotante } from '@/features/foro/identidad.js'
import { MetadatosDePublicacion } from '@/features/foro/MetadatosDePublicacion.jsx'
import { PanelDelForo } from '@/features/foro/PanelDelForo.jsx'
import { useVoto } from '@/features/foro/useVoto.js'
import { VolverAlForo } from '@/features/foro/VolverAlForo.jsx'
import { foro } from '@/shared/api/foro.js'
import { useFiltroEnUrl } from '@/shared/lib/useFiltroEnUrl.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { FiltroDeOpciones } from '@/shared/ui/FiltroDeOpciones.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { NoEncontradaPage } from './NoEncontradaPage.jsx'

/** Una publicación del foro completa, con su conversación en hilo. */
export function PublicacionForoPage() {
  const { id } = useParams()
  const consulta = useQuery(foro.publicacion(id, idDeVotante()))

  if (consulta.error?.status === 404) return <NoEncontradaPage />

  return (
    <PlantillaDePagina etiquetaDelPanel="Sobre el foro" panel={<PanelDelForo />}>
      <VolverAlForo />
      <EstadoDeConsulta consulta={consulta} esVacio={() => false}>
        {(publicacion) => (
          <>
            <PublicacionCompleta publicacion={publicacion} />
            <Conversacion publicacion={publicacion} />
          </>
        )}
      </EstadoDeConsulta>
    </PlantillaDePagina>
  )
}

function PublicacionCompleta({ publicacion }) {
  const voto = useVoto({
    objetivo: 'publicacion',
    id: publicacion.id,
    puntaje: publicacion.puntaje,
    miVoto: publicacion.mi_voto,
  })
  const ruta = RUTAS.publicacionForo(publicacion.id)

  return (
    <article className={`${CLASE_TARJETA_FORO} flex`}>
      <title>{`${publicacion.titulo} · Foro · ${PROYECTO.nombre}`}</title>
      <div className="hidden w-16 shrink-0 justify-center rounded-l-tarjeta bg-papel/70 py-6 sm:flex">
        <ControlDeVoto voto={voto} titulo={publicacion.titulo} />
      </div>
      <div className="min-w-0 flex-1 p-6 sm:p-8">
        <MetadatosDePublicacion publicacion={publicacion} />
        <h1 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl">
          {publicacion.titulo}
        </h1>
        <div className="mt-5 max-w-lectura text-lg leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line">
          {publicacion.contenido}
        </div>
        <div className="mt-6 -ml-2 flex flex-wrap items-center gap-1 border-t border-linea pt-4">
          <div className="sm:hidden">
            <ControlDeVoto voto={voto} orientacion="horizontal" titulo={publicacion.titulo} />
          </div>
          <span className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-tinta-suave">
            <Icono nombre="comentario" className="size-4" />
            {textoDeComentarios(publicacion.comentarios)}
          </span>
          <BotonCompartir ruta={ruta} titulo={publicacion.titulo} />
        </div>
      </div>
    </article>
  )
}

function Conversacion({ publicacion }) {
  const consulta = useQuery(foro.comentarios(publicacion.id, idDeVotante()))
  const [orden, cambiarOrden] = useFiltroEnUrl('comentarios', ['recientes'])

  return (
    <section
      id="comentarios"
      aria-labelledby="titulo-comentarios"
      className={`${CLASE_TARJETA_FORO} scroll-mt-28 space-y-8 p-6 sm:p-8`}
    >
      <div className="space-y-5">
        <h2 id="titulo-comentarios" className="font-sans text-xl font-bold">
          Comentarios
        </h2>
        <FormularioComentario publicacionId={publicacion.id} />
      </div>

      <div className="space-y-6 border-t border-linea pt-6">
        <FiltroDeOpciones
          etiqueta="Ordenar comentarios"
          opciones={ORDENES_DE_COMENTARIOS}
          valor={orden}
          onCambiar={cambiarOrden}
        />
        <EstadoDeConsulta
          consulta={consulta}
          esVacio={(comentarios) => comentarios.length === 0}
          vacio="Aún no hay comentarios. ¡Inicia la conversación!"
        >
          {(comentarios) => (
            <HiloDeComentarios
              hilo={armarHilo(comentarios, orden ?? 'mejores')}
              publicacionId={publicacion.id}
            />
          )}
        </EstadoDeConsulta>
      </div>
    </section>
  )
}
