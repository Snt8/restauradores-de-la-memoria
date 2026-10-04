import { useRouteError } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'

/** Se muestra si una página falla al cargar o al dibujarse, en vez de dejar la pantalla en blanco. */
export function ErrorPage() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)

  return (
    <EncabezadoDePagina
      titulo="Algo salió mal"
      entradilla="No pudimos mostrar esta página. Recarga el navegador o vuelve al inicio."
    >
      <div className="mt-8">
        <EnlaceBoton hacia={RUTAS.inicio} icono="flecha-derecha">
          Volver al inicio
        </EnlaceBoton>
      </div>
    </EncabezadoDePagina>
  )
}
