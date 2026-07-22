import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    const redirectMap = {
      student:    '/dashboard',
      instructor: '/instructor/dashboard',
      admin:      '/admin/dashboard',
    }
    return <Navigate to={redirectMap[user.role] || '/login'} replace />
  }

  return children
}
