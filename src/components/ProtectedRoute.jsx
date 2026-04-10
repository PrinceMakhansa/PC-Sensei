import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute — wraps routes that require authentication.
 * 
 * Usage:
 *   <ProtectedRoute>           → requires any logged-in user
 *   <ProtectedRoute role="admin"> → requires admin role
 * 
 * Shows nothing while auth is loading (avoids flash redirect).
 */
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  // Still checking token — render nothing to avoid flash
  if (loading) return null

  // Not logged in → send to auth page (or admin login for admin-only routes)
  if (!user) return <Navigate to={role === 'admin' ? '/admin-login' : '/auth'} replace />

  // Logged in but wrong role → send home
  if (role && user.role !== role) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute