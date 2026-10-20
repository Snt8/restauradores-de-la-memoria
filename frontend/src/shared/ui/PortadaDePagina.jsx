import { Link } from 'react-router'
import { CLASE_TARJETA } from './estilos.js'
import { Icono } from './Icono.jsx'
import { ImagenResponsiva } from './ImagenResponsiva.jsx'

const NOMBRE_DEL_SITIO = 'Restauradores de la Memoria'

// Cada grupo del portal tiene su color de banda, como el banner de una comunidad.
const BANDAS = {
  memoria:
    'bg-noche bg-[radial-gradient(circle_at_15%_120%,var(--color-memoria)_0,transparent_50%),radial-gradient(circle_at_85%_-20%,var(--color-rosa)_0,transparent_40%)]',
  rosa: 'bg-noche bg-[radial-gradient(circle_at_20%_130%,var(--color-rosa)_0,transparent_50%),radial-gradient(circle_at_90%_-30%,var(--color-vela)_0,transparent_35%)]',
  vela: 'bg-noche bg-[radial-gradient(circle_at_15%_130%,var(--color-vela)_0,transparent_45%),radial-gradient(circle_at_85%_-20%,var(--color-memoria)_0,transparent_40%)]',
  cielo:
    'bg-noche bg-[radial-gradient(circle_at_15%_130%,var(--color-cielo)_0,transparent_50%),radial-gradient(circle_at_85%_-20%,var(--color-memoria-claro)_0,transparent_40%)]',
}

/**
 * Portada de una página: banda de color (o imagen), ícono redondo, ruta de navegación,
 * título (h1), descripción y acciones. También fija el título de la pestaña.
 *
 * @param migas            [{ etiqueta, ruta }] páginas por encima de esta (opcional)
 * @param imagen           fondo de la banda en lugar del degradado (opcional)
 * @param escudo           imagen para el círculo en lugar del ícono (opcional)
 * @param tituloDocumento  título completo de la pestaña, si no es «título · sitio»
 */
export function PortadaDePagina({
  titulo,
  antetitulo,
  subtitulo,
  descripcion,
  icono = 'info',
  escudo,
  tono = 'memoria',
  imagen,
  migas = [],
  acciones,
  tituloDocumento,
  children,
}) {
  return (
    <div className={`${CLASE_TARJETA} overflow-hidden`}>
      <title>{tituloDocumento ?? `${titulo} · ${NOMBRE_DEL_SITIO}`}</title>
      <div
        aria-hidden="true"
        className={`relative isolate ${imagen ? 'h-36 bg-noche sm:h-52' : `h-20 sm:h-24 ${BANDAS[tono]}`}`}
      >
        {imagen && (
          <>
            <ImagenResponsiva
              url={imagen}
              alt=""
              carga="eager"
              sizes="(min-width: 1280px) 60rem, 100vw"
              className="absolute inset-0 -z-10 size-full object-cover opacity-70"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noche/70 to-transparent" />
          </>
        )}
      </div>

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex items-end gap-4">
          <span className="relative -mt-9 grid size-18 shrink-0 place-items-center rounded-full border-4 border-superficie bg-white text-memoria shadow-tarjeta sm:-mt-11 sm:size-22">
            {escudo ? (
              <img
                src={escudo}
                alt=""
                width="48"
                height="44"
                className="size-10 object-contain sm:size-12"
              />
            ) : (
              <Icono nombre={icono} className="size-8 sm:size-9" />
            )}
          </span>
          <div className="min-w-0 pb-1">
            {migas.length > 0 && <Migas migas={migas} actual={titulo} />}
            {antetitulo && (
              <p className="text-sm font-semibold tracking-widest text-memoria uppercase">
                {antetitulo}
              </p>
            )}
          </div>
        </div>

        <h1 className="mt-4 max-w-4xl text-3xl leading-tight font-semibold sm:text-4xl">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="mt-3 font-display text-xl text-tinta-suave italic sm:text-2xl">
            {subtitulo}
          </p>
        )}
        {descripcion && (
          <p className="mt-4 max-w-lectura text-lg leading-relaxed text-tinta-suave">
            {descripcion}
          </p>
        )}
        {acciones && <div className="mt-6 flex flex-wrap gap-3">{acciones}</div>}
        {children}
      </div>
    </div>
  )
}

function Migas({ migas, actual }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-1 text-sm text-tinta-suave">
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {migas.map((miga) => (
          <li key={miga.ruta} className="inline-flex items-center gap-1.5">
            <Link to={miga.ruta} className="font-semibold hover:text-memoria hover:underline">
              {miga.etiqueta}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="max-w-[16rem] truncate">
          {actual}
        </li>
      </ol>
    </nav>
  )
}
