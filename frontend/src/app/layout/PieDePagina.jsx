import { Link } from 'react-router'
import { PAGINAS_DEL_MENU } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'

export function PieDePagina() {
  return (
    <footer className="border-t border-linea bg-papel">
      <Contenedor className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
        <div className="space-y-2">
          <p className="font-display text-xl font-semibold">{PROYECTO.nombre}</p>
          <p className="text-memoria italic">«{PROYECTO.lema}»</p>
          <p className="text-sm text-tinta-suave">
            {PROYECTO.colegio} · {PROYECTO.localidad}
          </p>
          <a
            href={`mailto:${PROYECTO.correo}`}
            className="inline-flex items-center gap-2 text-sm [overflow-wrap:anywhere] text-tinta-suave hover:text-memoria"
          >
            <Icono nombre="correo" className="size-4 shrink-0" />
            {PROYECTO.correo}
          </a>
        </div>
        <nav aria-label="Mapa del sitio">
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-semibold text-tinta-suave">
            {PAGINAS_DEL_MENU.map((pagina) => (
              <li key={pagina.ruta}>
                <Link to={pagina.ruta} className="hover:text-memoria">
                  {pagina.corta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Contenedor>
      <div className="border-t border-linea">
        <Contenedor className="py-5 text-sm text-tinta-suave">
          Portal desarrollado por el equipo del curso de Programación Web para el proyecto
          Restauradores de la Memoria. Fotografías: archivo del proyecto.
        </Contenedor>
      </div>
    </footer>
  )
}
