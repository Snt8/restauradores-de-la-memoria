/** Trazos de 24×24 (estilo línea). Un solo componente evita repetir el marcado SVG. */
const TRAZOS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  cerrar: 'M6 6l12 12M18 6L6 18',
  'flecha-derecha': 'M5 12h14M13 6l6 6-6 6',
  'flecha-izquierda': 'M19 12H5M11 6l-6 6 6 6',
  'chevron-abajo': 'M6 9l6 6 6-6',
  reproducir: 'M8 5v14l11-7z',
  audio: 'M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  'enlace-externo': 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  ubicacion:
    'M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  cubo: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v18M4 7.5l8 4.5 8-4.5',
  imagen: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9.5a1.5 1.5 0 1 0 0-.01',
  documento: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  correo: 'M4 6h16v12H4zM4 7l8 6 8-6',
  calendario: 'M5 5h14v15H5zM5 10h14M9 3v4M15 3v4',
  visor: 'M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4',
}

export function Icono({ nombre, className = 'size-5', titulo }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      focusable="false"
    >
      <path d={TRAZOS[nombre]} />
    </svg>
  )
}
