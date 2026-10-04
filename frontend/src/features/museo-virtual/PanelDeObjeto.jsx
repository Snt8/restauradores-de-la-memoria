import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'

/**
 * Ficha resumida del objeto seleccionado, superpuesta a la escena. Es HTML (no texto 3D)
 * para que sea legible, seleccionable y accesible con lector de pantalla.
 */
export function PanelDeObjeto({ objeto, onCerrar }) {
  return (
    <aside
      aria-label={`Información de ${objeto.nombre}`}
      className="absolute inset-x-3 bottom-3 max-h-[60%] overflow-y-auto rounded-tarjeta bg-papel/95 p-5 shadow-tarjeta backdrop-blur sm:right-auto sm:left-3 sm:w-96"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold">{objeto.nombre}</h2>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar la información del objeto"
          className="-mt-1 -mr-1 rounded-full p-1.5 hover:bg-papel-hondo"
        >
          <Icono nombre="cerrar" />
        </button>
      </div>
      {objeto.foto_url && (
        <ImagenResponsiva
          url={objeto.foto_url}
          alt={`Fotografía de ${objeto.nombre}`}
          sizes="24rem"
          className="mt-3 aspect-[4/3] w-full rounded-lg object-cover"
        />
      )}
      <p className="mt-3 text-sm leading-relaxed text-tinta-suave">{objeto.descripcion}</p>
      {objeto.importancia_memoria && (
        <p className="mt-3 text-sm leading-relaxed">
          <span className="font-semibold">Importancia para la memoria: </span>
          {objeto.importancia_memoria}
        </p>
      )}
      {objeto.creditos && (
        <p className="mt-3 text-xs text-tinta-suave">Créditos: {objeto.creditos}</p>
      )}
      <Link
        to={RUTAS.objeto(objeto.slug)}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-memoria hover:underline"
      >
        Ver la ficha completa <Icono nombre="flecha-derecha" className="size-4" />
      </Link>
    </aside>
  )
}
