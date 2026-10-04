import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes.jsx'

const router = createBrowserRouter(routes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
