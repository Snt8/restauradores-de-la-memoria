import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { CLASE_TARJETA_ENLAZADA } from '@/shared/ui/estilos.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'

/** Objeto del museo en una cuadrícula: foto (o aviso de que solo hay modelo 3D) y enlace a su ficha. */
export function TarjetaDeObjeto({ objeto }) {
  return (
    <article className={`${CLASE_TARJETA_ENLAZADA} group relative h-full overflow-hidden`}>
      <div className="aspect-[4/3] bg-noche-suave">
        {objeto.foto_url ? (
          <ImagenResponsiva
            url={objeto.foto_url}
            alt={`Fotografía de ${objeto.nombre}`}
            sizes="(min-width: 640px) 22rem, 100vw"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-white/70">
            <Icono nombre="cubo" className="size-12" />
            <span className="text-sm">Modelo 3D disponible · fotografía pendiente</span>
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-sans text-lg font-semibold">
          <Link
            to={RUTAS.objeto(objeto.slug)}
            className="group-hover:text-memoria after:absolute after:inset-0"
          >
            {objeto.nombre}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-tinta-suave">
          {objeto.descripcion}
        </p>
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-memoria">
          Ver ficha y modelo 3D <Icono nombre="flecha-derecha" className="size-4" />
        </p>
      </div>
    </article>
  )
}
