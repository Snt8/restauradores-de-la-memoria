import { useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { MENU, RUTAS } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { MenuDesplegable } from './MenuDesplegable.jsx'

const claseEnlace = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-semibold hover:text-memoria ${isActive ? 'text-memoria' : ''}`

export function Encabezado() {
  // Se guarda la ruta en la que se abrió el menú: al navegar deja de coincidir y se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState(null)
  const idMenuMovil = useId()
  const { pathname } = useLocation()
  const menuMovilAbierto = abiertoEn === pathname

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-papel/95 backdrop-blur">
      <Contenedor className="flex items-center justify-between gap-4 py-3">
        <Link to={RUTAS.inicio} className="flex items-center gap-3">
          <img
            src={miniaturaDeImagen(PROYECTO.escudo)}
            alt=""
            width="40"
            height="37"
            className="size-10 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">{PROYECTO.nombre}</span>
            <span className="block text-xs text-tinta-suave">{PROYECTO.colegio}</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 xl:flex">
          {MENU.map((entrada) =>
            entrada.paginas ? (
              <MenuDesplegable
                key={entrada.etiqueta}
                etiqueta={entrada.etiqueta}
                paginas={entrada.paginas}
              />
            ) : (
              <NavLink key={entrada.ruta} to={entrada.ruta} end className={claseEnlace}>
                {entrada.etiqueta}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo">
              Museo Virtual
            </EnlaceBoton>
          </div>
          <button
            type="button"
            className="rounded-full p-2 xl:hidden"
            aria-expanded={menuMovilAbierto}
            aria-controls={idMenuMovil}
            onClick={() => setAbiertoEn(menuMovilAbierto ? null : pathname)}
          >
            <Icono nombre={menuMovilAbierto ? 'cerrar' : 'menu'} className="size-6" />
            <span className="sr-only">{menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </Contenedor>

      <nav
        id={idMenuMovil}
        aria-label="Principal (móvil)"
        hidden={!menuMovilAbierto}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-linea bg-papel xl:hidden"
      >
        <Contenedor as="ul" className="grid gap-1 py-4 sm:grid-cols-2">
          {MENU.flatMap((entrada) => entrada.paginas ?? [entrada]).map((pagina) => (
            <li key={pagina.ruta}>
              <NavLink
                to={pagina.ruta}
                end
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 font-semibold hover:bg-papel-hondo ${
                    isActive ? 'bg-papel-hondo text-memoria' : ''
                  }`
                }
              >
                {pagina.etiqueta}
              </NavLink>
            </li>
          ))}
        </Contenedor>
      </nav>
    </header>
  )
}
