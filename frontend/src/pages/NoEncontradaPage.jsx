import { RUTAS } from '@/app/navegacion.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

export function NoEncontradaPage() {
  return (
    <PortadaDePagina
      titulo="Página no encontrada"
      descripcion="La página que buscas no existe o fue movida. Usa el menú para encontrar la sección que necesitas."
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
