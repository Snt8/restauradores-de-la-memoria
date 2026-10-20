import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { PROYECTO, QUE_ES } from '@/content/sitio.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'

/**
 * Tarjetas de la columna derecha que se repiten en varias páginas. Cada una enlaza la
 * sección con otra parte del portal, para que el visitante siempre tenga un siguiente paso.
 */

export function AcercaDelProyecto() {
  return (
    <TarjetaPanel titulo="Acerca del proyecto" destacada>
      <figure className="border-l-4 border-vela pl-4">
        <blockquote className="font-display text-lg leading-snug">«{QUE_ES.cita.texto}»</blockquote>
        <figcaption className="mt-2 text-xs text-tinta-suave">{QUE_ES.cita.fuente}</figcaption>
      </figure>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="sr-only">Institución</dt>
          <dd className="font-semibold">{PROYECTO.colegio}</dd>
        </div>
        <div>
          <dt className="sr-only">Ubicación</dt>
          <dd className="text-tinta-suave">{PROYECTO.localidad}</dd>
        </div>
      </dl>
      <EnlaceBoton
        hacia={RUTAS.queEs}
        variante="secundario"
        icono="flecha-derecha"
        className="w-full justify-center"
      >
        Conocer el proyecto
      </EnlaceBoton>
    </TarjetaPanel>
  )
}

export function AccesoAlMuseoVirtual() {
  return (
    <TarjetaPanel titulo="Museo Virtual">
      <p className="text-sm leading-relaxed text-tinta-suave">
        Camina por una sala del Museo Escolar en 3D, acércate a cada objeto y mira las fotografías
        de sus ediciones.
      </p>
      <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo" className="w-full justify-center">
        Recorrer la sala 3D
      </EnlaceBoton>
    </TarjetaPanel>
  )
}

/**
 * Invita a seguir la conversación en el foro, en la categoría que corresponde a la sección.
 * @param categoria  valor de una categoría del foro (p. ej. «salidas»)
 */
export function InvitacionAlForo({ titulo = 'Conversa en el foro', texto, categoria }) {
  const consulta = categoria ? `?categoria=${categoria}` : ''

  return (
    <TarjetaPanel titulo={titulo}>
      <p className="text-sm leading-relaxed text-tinta-suave">
        {texto ?? 'Pregunta, comparte un recuerdo o cuéntanos qué te dejó esta sección.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <EnlaceBoton hacia={`${RUTAS.nuevaPublicacionForo}${consulta}`} icono="mas">
          Publicar
        </EnlaceBoton>
        <Link
          to={`${RUTAS.foro}${consulta}`}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-memoria hover:bg-memoria/10"
        >
          Ver conversaciones
          <Icono nombre="flecha-derecha" className="size-4" />
        </Link>
      </div>
    </TarjetaPanel>
  )
}
