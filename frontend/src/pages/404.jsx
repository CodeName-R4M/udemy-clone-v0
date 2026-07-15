
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary-red">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary-blue hover:underline font-bold">Go back home</Link>
    </div>
  )
}

export default NotFound
