import { useId } from 'react'
import { Link, useLocation } from 'react-router'
import { MENU } from '@/app/navegacion.js'
import { paginaActiva } from '@/app/paginaActiva.js'
import { usePrecarga } from '@/app/usePrecarga.js'
import { Icono } from '@/shared/ui/Icono.jsx'

/**
 * Navegación principal en grupos, con íconos, como la barra lateral de Reddit. Es fija a
 * la izquierda desde `lg` y la misma lista se usa dentro del menú móvil.
 */
export function NavegacionLateral({ etiqueta = 'Principal', id }) {
  const { pathname } = useLocation()
  const activa = paginaActiva(pathname)
  const precargar = usePrecarga()
  const idBase = useId()

  return (
    <nav id={id} aria-label={etiqueta}>
      {MENU.map((grupo, indice) => {
        const idTitulo = `${idBase}-${indice}`
        return (
          <div
            key={grupo.titulo ?? 'principal'}
            className={indice > 0 ? 'mt-4 border-t border-linea pt-4' : ''}
          >
            {grupo.titulo && (
              <p
                id={idTitulo}
                className="mb-1.5 px-3 text-xs font-bold tracking-widest text-tinta-suave uppercase"
              >
                {grupo.titulo}
              </p>
            )}
            <ul aria-labelledby={grupo.titulo ? idTitulo : undefined} className="space-y-0.5">
              {grupo.paginas.map((pagina) => {
                const actual = pagina === activa
                return (
                  <li key={pagina.ruta}>
                    <Link
                      to={pagina.ruta}
                      aria-current={actual ? 'page' : undefined}
                      {...precargar(pagina.ruta)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors ${
                        actual
                          ? 'bg-memoria/10 text-memoria-hondo'
                          : 'text-tinta-suave hover:bg-tinta/5 hover:text-tinta'
                      }`}
                    >
                      <Icono nombre={pagina.icono} className="size-5 shrink-0" />
                      {pagina.corta}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
