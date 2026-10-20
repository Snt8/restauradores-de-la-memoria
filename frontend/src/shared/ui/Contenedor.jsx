const ANCHOS = {
  // Secciones de contenido: el texto no se estira más allá de una lectura cómoda.
  normal: 'max-w-6xl',
  // Diseños de varias columnas (foro, encabezado): aprovechan pantallas grandes.
  amplio: 'max-w-7xl',
}

/** Ancho máximo y márgenes laterales comunes a todo el portal. */
export function Contenedor({
  as: Etiqueta = 'div',
  ancho = 'normal',
  className = '',
  children,
  ...props
}) {
  return (
    <Etiqueta
      className={`mx-auto w-full ${ANCHOS[ancho]} px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Etiqueta>
  )
}
