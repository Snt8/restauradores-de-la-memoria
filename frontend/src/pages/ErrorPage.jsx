import { useRouteError } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

/** Se muestra si una página falla al cargar o al dibujarse, en vez de dejar la pantalla en blanco. */
export function ErrorPage() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)

  return (
    <PortadaDePagina
      titulo="Algo salió mal"
      descripcion="No pudimos mostrar esta página. Recarga el navegador o vuelve al inicio."
      icono="info"
      tono="rosa"
      acciones={
        <EnlaceBoton hacia={RUTAS.inicio} icono="flecha-derecha">
          Volver al inicio
        </EnlaceBoton>
      }
    />
  )
}
