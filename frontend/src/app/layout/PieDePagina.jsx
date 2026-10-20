import { Link } from 'react-router'
import { MENU } from '@/app/navegacion.js'
import { PROYECTO } from '@/content/sitio.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'

export function PieDePagina() {
  const paginas = MENU.flatMap((entrada) => entrada.paginas ?? [entrada])

  return (
    <footer className="bg-noche text-white/80">
      <Contenedor ancho="amplio" className="grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr] lg:py-20">
        <div className="space-y-3">
          <p className="font-display text-2xl text-white">{PROYECTO.nombre}</p>
          <p className="text-vela italic">«{PROYECTO.lema}»</p>
          <p>
            {PROYECTO.colegio}
            <br />
            {PROYECTO.localidad}
          </p>
          <a
            href={`mailto:${PROYECTO.correo}`}
            className="inline-flex items-center gap-2 text-sm [overflow-wrap:anywhere] hover:text-vela"
          >
            <Icono nombre="correo" className="size-4 shrink-0" />
            {PROYECTO.correo}
          </a>
        </div>
        <nav aria-label="Mapa del sitio">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {paginas.map((pagina) => (
              <li key={pagina.ruta}>
                <Link to={pagina.ruta} className="hover:text-vela">
                  {pagina.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Contenedor>
      <div className="border-t border-white/10">
        <Contenedor ancho="amplio" className="py-6 text-sm text-white/60">
          Portal desarrollado por el equipo del curso de Programación Web para el proyecto
          Restauradores de la Memoria. Fotografías: archivo del proyecto.
        </Contenedor>
      </div>
    </footer>
  )
}
