import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { recortar } from './validacion.js'

/**
 * Estado común de los formularios del foro: datos, errores por campo, foco en el primer
 * error y envío a la API. Cada formulario solo aporta sus campos, su validación y qué
 * hacer al terminar.
 */
export function useFormularioForo({ inicial, validar, enviar, alPublicar }) {
  const [datos, setDatos] = useState(inicial)
  const [errores, setErrores] = useState({})
  const formulario = useRef(null)
  const envio = useMutation({
    mutationFn: (carga) => enviar(carga),
    onSuccess: (respuesta, carga) => alPublicar(respuesta, carga),
  })

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }))
    if (errores[campo]) setErrores(({ [campo]: _resuelto, ...resto }) => resto)
  }

  function alEnviar(evento) {
    evento.preventDefault()
    const encontrados = validar(datos)
    setErrores(encontrados)
    const primero = Object.keys(encontrados)[0]
    if (primero) {
      // Un grupo de radios llega como RadioNodeList: se enfoca su primera opción.
      const elemento = formulario.current.elements.namedItem(primero)
      ;(elemento?.focus ? elemento : elemento?.[0])?.focus()
      return
    }
    envio.mutate(recortar(datos))
  }

  const campo = (nombre) => ({
    nombre,
    valor: datos[nombre],
    error: errores[nombre],
    onCambiar: (valor) => actualizar(nombre, valor),
  })

  return { datos, setDatos, errores, formulario, envio, alEnviar, actualizar, campo }
}

/** Mensaje de error de la API si es legible, o uno genérico. */
export function mensajeDeError(error) {
  const detalle = error?.body?.detail
  return typeof detalle === 'string'
    ? detalle
    : 'No pudimos publicar. Revisa tu conexión e inténtalo de nuevo.'
}
