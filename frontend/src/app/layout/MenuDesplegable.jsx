import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Icono } from '@/shared/ui/Icono.jsx'

/**
 * Grupo del menú principal (patrón «disclosure»): un botón que muestra u oculta una
 * lista de enlaces. Se cierra con Escape, al hacer clic fuera o al navegar.
 */
export function MenuDesplegable({ etiqueta, paginas }) {
  // Abierto solo en la ruta donde se abrió: al navegar se cierra sin efectos adicionales.
  const [abiertoEn, setAbiertoEn] = useState(null)
  const contenedor = useRef(null)
  const idLista = useId()
  const { pathname } = useLocation()
  const abierto = abiertoEn === pathname
  const setAbierto = (valor) => setAbiertoEn(valor ? pathname : null)
  const contieneRutaActual = paginas.some((pagina) => pagina.ruta === pathname)

  useEffect(() => {
    if (!abierto) return undefined
    const alHacerClicFuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbiertoEn(null)
    }
    document.addEventListener('pointerdown', alHacerClicFuera)
    return () => document.removeEventListener('pointerdown', alHacerClicFuera)
  }, [abierto])

  function alPresionarTecla(evento) {
    if (evento.key === 'Escape' && abierto) {
      setAbierto(false)
      contenedor.current?.querySelector('button')?.focus()
    }
  }

  return (
    <div ref={contenedor} className="relative" onKeyDown={alPresionarTecla}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={idLista}
        onClick={() => setAbierto(!abierto)}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold hover:text-memoria ${
          contieneRutaActual ? 'text-memoria' : ''
        }`}
      >
        {etiqueta}
        <Icono
          nombre="chevron-abajo"
          className={`size-4 transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>
      <ul
        id={idLista}
        hidden={!abierto}
        className="absolute top-full left-0 z-20 mt-2 w-72 rounded-tarjeta border border-linea bg-white p-2 shadow-tarjeta"
      >
        {paginas.map((pagina) => (
          <li key={pagina.ruta}>
            <NavLink
              to={pagina.ruta}
              end
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 hover:bg-papel-hondo ${isActive ? 'bg-papel-hondo' : ''}`
              }
            >
              <span className="block text-sm font-semibold">{pagina.etiqueta}</span>
              <span className="block text-xs text-tinta-suave">{pagina.descripcion}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
