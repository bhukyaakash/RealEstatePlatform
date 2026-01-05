import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <div className="text-6xl font-bold text-gray-300">404</div>
      <div className="text-xl font-semibold mt-2">Page not found</div>
      <Link className="text-blue-700 block mt-4" to="/">Go Home</Link>
    </div>
  )
}
