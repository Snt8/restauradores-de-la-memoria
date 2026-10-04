const TONOS = {
  neutro: 'bg-papel-hondo text-tinta-suave',
  memoria: 'bg-memoria/10 text-memoria-hondo',
  vela: 'bg-vela/30 text-tinta',
  rosa: 'bg-rosa/10 text-rosa',
}

export function Etiqueta({ tono = 'neutro', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONOS[tono]}`}
    >
      {children}
    </span>
  )
}
