import { Link, useSearchParams } from 'react-router'
import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR } from '@/content/foro.js'
import { PROYECTO } from '@/content/sitio.js'
import { FormularioPublicacion } from '@/features/foro/FormularioPublicacion.jsx'
import { PanelDelForo } from '@/features/foro/PanelDelForo.jsx'
import { CLASE_TARJETA_FORO } from '@/features/foro/estilos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'

const TITULO = 'Crear una publicación'

export function NuevaPublicacionForoPage() {
  const [parametros] = useSearchParams()
  const categoria = CATEGORIA_POR_VALOR[parametros.get('categoria')]?.valor

  return (
    <div className="bg-fondo-foro">
      <title>{`${TITULO} · ${PAGINAS.foro.etiqueta} · ${PROYECTO.nombre}`}</title>
      <Contenedor
        ancho="amplio"
        className="grid grid-cols-[minmax(0,1fr)] gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10"
      >
        <div className="min-w-0 space-y-6">
          <Link
            to={RUTAS.foro}
            className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-semibold text-tinta-suave hover:text-memoria"
          >
            <Icono nombre="flecha-izquierda" className="size-4" />
            Volver al foro
          </Link>
          <section aria-labelledby="titulo-nueva" className={`${CLASE_TARJETA_FORO} p-6 sm:p-10`}>
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
        </div>
        <PanelDelForo conBotonPublicar={false} />
      </Contenedor>
    </div>
  )
}
