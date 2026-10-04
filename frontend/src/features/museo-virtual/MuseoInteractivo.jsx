import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { VistaDeEvidencia } from '@/entities/evidencia/VistaDeEvidencia.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { useNavegacionEnLista } from '@/shared/ui/useNavegacionEnLista.js'
import { Visor } from '@/shared/ui/Visor.jsx'
import { EscenaMuseo } from './EscenaMuseo.jsx'
import { useCamaraDelMuseo, useProporciones } from './hooks.js'
import { PanelDeObjeto } from './PanelDeObjeto.jsx'
import { distribuirCuadros, paradasDelRecorrido } from './sala.js'

/**
 * Museo Virtual completo: la escena 3D, la ficha del objeto elegido, la visita guiada
 * y una lista accesible de los objetos (alternativa a recorrer la sala en 3D).
 * `?objeto=slug` en la URL abre la sala directamente frente a ese objeto.
 */
export function MuseoInteractivo({ objetos, exposiciones }) {
  const [parametros, setParametros] = useSearchParams()
  const seleccionado = parametros.get('objeto')
  const objeto = objetos.find((o) => o.slug === seleccionado) ?? null

  const camara = useCamaraDelMuseo()
  const paradas = useMemo(() => paradasDelRecorrido(objetos), [objetos])
  const [parada, setParada] = useState(null)
  const cuadros = useMemo(() => distribuirCuadros(exposiciones), [exposiciones])
  const proporciones = useProporciones(cuadros.map((c) => c.evidencia.url))
  const visorDeCuadros = useNavegacionEnLista(cuadros.length)
  const cuadroAbierto = visorDeCuadros.abierto ? cuadros[visorDeCuadros.indice] : null

  function seleccionar(slug) {
    setParametros(
      (previos) => {
        const siguientes = new URLSearchParams(previos)
        if (slug) siguientes.set('objeto', slug)
        else siguientes.delete('objeto')
        return siguientes
      },
      { replace: true, preventScrollReset: true },
    )
  }

  function visitar(indice) {
    const destino = paradas[indice]
    setParada(indice)
    seleccionar(destino.slug)
    camara.irA(destino)
  }

  function volverALaEntrada() {
    setParada(null)
    seleccionar(null)
    camara.irALaEntrada()
  }

  // Enlace directo (?objeto=slug): al abrir la sala, lleva al visitante frente al objeto.
  const enlaceInicial = useRef(seleccionado)
  useEffect(() => {
    const destino = paradas.find((p) => p.slug === enlaceInicial.current)
    if (destino) camara.alCargar(() => camara.irA(destino))
    // Solo al montar: después, la navegación la deciden los controles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="relative h-[70dvh] min-h-96 overflow-hidden rounded-tarjeta bg-noche shadow-tarjeta">
        <EscenaMuseo
          objetos={objetos}
          cuadros={cuadros}
          proporciones={proporciones}
          seleccionado={seleccionado}
          escenaRef={camara.escena}
          rigRef={camara.rig}
          camaraRef={camara.camara}
          onSeleccionarObjeto={(slug) => {
            // Elegido con el cursor: el visitante ya está frente a él, la cámara no se mueve.
            seleccionar(slug)
            setParada(paradas.findIndex((p) => p.slug === slug))
          }}
          onAbrirCuadro={visorDeCuadros.abrir}
        />
        {objeto && <PanelDeObjeto objeto={objeto} onCerrar={() => seleccionar(null)} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section
          aria-labelledby="titulo-visita"
          className="rounded-tarjeta bg-white p-5 shadow-tarjeta"
        >
          <h2 id="titulo-visita" className="text-xl font-semibold">
            Visita guiada
          </h2>
          <p aria-live="polite" className="mt-1 text-sm text-tinta-suave">
            {parada === null
              ? `Recorre las ${paradas.length} piezas de la sala, una por una.`
              : `Parada ${parada + 1} de ${paradas.length}: ${paradas[parada].nombre}`}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <BotonDeVisita
              disabled={parada === null || parada === 0}
              onClick={() => visitar(parada - 1)}
            >
              <Icono nombre="flecha-izquierda" className="size-4" /> Anterior
            </BotonDeVisita>
            <BotonDeVisita
              principal
              disabled={paradas.length === 0 || parada === paradas.length - 1}
              onClick={() => visitar(parada === null ? 0 : parada + 1)}
            >
              {parada === null ? 'Comenzar la visita' : 'Siguiente pieza'}
              <Icono nombre="flecha-derecha" className="size-4" />
            </BotonDeVisita>
            <BotonDeVisita onClick={volverALaEntrada}>Volver a la entrada</BotonDeVisita>
          </div>
        </section>

        <nav
          aria-label="Objetos de la sala"
          className="rounded-tarjeta bg-white p-5 shadow-tarjeta"
        >
          <h2 className="text-xl font-semibold">Objetos de la sala</h2>
          <ul className="mt-3 space-y-1">
            {paradas.map((destino, indice) => (
              <li key={destino.slug}>
                <button
                  type="button"
                  aria-current={destino.slug === seleccionado ? 'true' : undefined}
                  onClick={() => visitar(indice)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-papel-hondo aria-[current]:bg-papel-hondo aria-[current]:font-semibold"
                >
                  <Icono nombre="cubo" className="size-4 text-memoria" />
                  {destino.nombre}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Visor
        abierto={visorDeCuadros.abierto}
        titulo={
          cuadroAbierto ? `${cuadroAbierto.evidencia.titulo} · ${cuadroAbierto.exposicion}` : ''
        }
        posicion={visorDeCuadros.posicion}
        onCerrar={visorDeCuadros.cerrar}
        onAnterior={visorDeCuadros.anterior}
        onSiguiente={visorDeCuadros.siguiente}
      >
        {cuadroAbierto && <VistaDeEvidencia evidencia={cuadroAbierto.evidencia} />}
      </Visor>
    </div>
  )
}

function BotonDeVisita({ principal, children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 ${
        principal
          ? 'bg-memoria text-white hover:bg-memoria-hondo'
          : 'border border-tinta/20 hover:border-memoria hover:text-memoria'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
