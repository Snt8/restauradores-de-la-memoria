/**
 * Distribución común de las páginas, como una comunidad de Reddit: la portada arriba,
 * el contenido en la columna central y un panel de información a la derecha. Desde `xl`
 * el panel es una columna propia; en pantallas menores pasa debajo del contenido.
 *
 * @param portada  normalmente un <PortadaDePagina />
 * @param panel    tarjetas de la columna derecha (opcional)
 */
export function PlantillaDePagina({
  portada,
  panel,
  etiquetaDelPanel = 'Información relacionada',
  children,
}) {
  return (
    <div className="space-y-6">
      {portada}
      <div
        className={
          panel
            ? 'grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8'
            : ''
        }
      >
        <div className="min-w-0 space-y-6">{children}</div>
        {panel && (
          <aside aria-label={etiquetaDelPanel} className="space-y-5">
            {panel}
          </aside>
        )}
      </div>
    </div>
  )
}
