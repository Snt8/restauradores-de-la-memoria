import { useSearchParams } from 'react-router'
import { PAGINAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR } from '@/content/foro.js'
import { PROYECTO } from '@/content/sitio.js'
import { FormularioPublicacion } from '@/features/foro/FormularioPublicacion.jsx'
import { PanelDelForo } from '@/features/foro/PanelDelForo.jsx'
import { VolverAlForo } from '@/features/foro/VolverAlForo.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'

const TITULO = 'Crear una publicación'

export function NuevaPublicacionForoPage() {
  const [parametros] = useSearchParams()
  const categoria = CATEGORIA_POR_VALOR[parametros.get('categoria')]?.valor

  return (
    <PlantillaDePagina
      etiquetaDelPanel="Sobre el foro"
      panel={<PanelDelForo conBotonPublicar={false} />}
    >
      <title>{`${TITULO} · ${PAGINAS.foro.etiqueta} · ${PROYECTO.nombre}`}</title>
      <VolverAlForo />
      <section aria-labelledby="titulo-nueva" className={`${CLASE_TARJETA} p-6 sm:p-10`}>
        <h1 id="titulo-nueva" className="text-3xl font-semibold sm:text-4xl">
          {TITULO}
        </h1>
        <p className="mt-3 max-w-lectura text-tinta-suave">
          Las publicaciones son públicas. Antes de escribir, revisa las normas de convivencia.
        </p>
        <div className="mt-8">
          <FormularioPublicacion categoriaInicial={categoria} />
        </div>
      </section>
    </PlantillaDePagina>
  )
}
