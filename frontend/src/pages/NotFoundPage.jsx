import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section aria-labelledby="titulo-no-encontrado">
      <h1 id="titulo-no-encontrado" className="text-2xl font-bold">
        Página no encontrada
      </h1>
      <p className="mt-2">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Volver al inicio
      </Link>
    </section>
  )
}
