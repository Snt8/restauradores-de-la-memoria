import { useEffect, useId, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { NavegacionLateral } from './NavegacionLateral.jsx'

/**
 * Barra superior: menú (solo en pantallas menores a `lg`, donde no hay barra lateral),
 * identidad del proyecto y los dos accesos que más se usan.
 */
export function Encabezado() {
  // Se guarda la ruta en la que se abrió el menú: al navegar deja de coincidir y se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState(null)
  const idMenuMovil = useId()
  const { pathname } = useLocation()
  const menuMovilAbierto = abiertoEn === pathname

  useEffect(() => {
    if (!menuMovilAbierto) return undefined
    const alPresionarTecla = (evento) => evento.key === 'Escape' && setAbiertoEn(null)
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [menuMovilAbierto])

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-papel/95 backdrop-blur">
      <Contenedor className="flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 hover:bg-tinta/5 lg:hidden"
            aria-expanded={menuMovilAbierto}
            aria-controls={idMenuMovil}
            onClick={() => setAbiertoEn(menuMovilAbierto ? null : pathname)}
          >
            <Icono nombre={menuMovilAbierto ? 'cerrar' : 'menu'} className="size-6" />
            <span className="sr-only">{menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
          <Link to={RUTAS.inicio} className="flex min-w-0 items-center gap-3">
            <img
              src={miniaturaDeImagen(PROYECTO.escudo)}
              alt=""
              width="40"
              height="37"
              className="size-9 shrink-0 object-contain sm:size-10"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg font-semibold">
                {PROYECTO.nombre}
              </span>
              <span className="block truncate text-xs text-tinta-suave">{PROYECTO.colegio}</span>
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* EnlaceBoton ya es inline-flex: se oculta su contenedor, no el botón. */}
          <div className="hidden md:block">
            <EnlaceBoton hacia={RUTAS.nuevaPublicacionForo} variante="secundario" icono="mas">
              Publicar en el foro
            </EnlaceBoton>
          </div>
          <div className="hidden sm:block">
            <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo">
              Museo Virtual
            </EnlaceBoton>
          </div>
        </div>
      </Contenedor>

      <div
        id={idMenuMovil}
        hidden={!menuMovilAbierto}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-linea bg-papel lg:hidden"
      >
        <Contenedor className="py-4">
          <NavegacionLateral etiqueta="Principal (móvil)" />
        </Contenedor>
      </div>
    </header>
  )
}
