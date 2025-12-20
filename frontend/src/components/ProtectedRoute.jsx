import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../services'

function ProtectedRoute({ children, requireAuth = true }) {
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()

  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from login/register pages
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute