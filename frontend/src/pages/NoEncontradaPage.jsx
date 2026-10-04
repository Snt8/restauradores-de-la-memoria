import { RUTAS } from '@/app/navegacion.js'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'

export function NoEncontradaPage() {
  return (
    <EncabezadoDePagina
      titulo="Página no encontrada"
      entradilla="La página que buscas no existe o fue movida."
    >
      <div className="mt-8">
        <EnlaceBoton hacia={RUTAS.inicio} icono="flecha-derecha">
          Volver al inicio
        </EnlaceBoton>
      </div>
    </EncabezadoDePagina>
  )
}
