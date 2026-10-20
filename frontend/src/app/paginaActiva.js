import { PAGINAS_DEL_MENU, RUTAS } from './navegacion.js'

/**
 * Página del menú que corresponde a una ruta: la de prefijo más largo. Así una
 * publicación del foro marca «Foro» y la ficha de un objeto marca «Museo Escolar»,
 * mientras que «Inicio» solo se marca en la portada.
 */
export function paginaActiva(pathname, paginas = PAGINAS_DEL_MENU) {
  let mejor = null
  for (const pagina of paginas) {
    const coincide =
      pagina.ruta === RUTAS.inicio
        ? pathname === RUTAS.inicio
        : pathname === pagina.ruta || pathname.startsWith(`${pagina.ruta}/`)
    if (coincide && (!mejor || pagina.ruta.length > mejor.ruta.length)) mejor = pagina
  }
  return mejor
}
