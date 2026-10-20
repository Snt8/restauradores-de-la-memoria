/**
 * Ancho máximo y márgenes laterales de la estructura del portal (barra superior,
 * navegación lateral + contenido, pie). Las páginas no lo usan: se acomodan en la
 * columna que les deja el layout.
 */
export function Contenedor({ as: Etiqueta = 'div', className = '', children, ...props }) {
  return (
    <Etiqueta
      className={`mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Etiqueta>
  )
}
