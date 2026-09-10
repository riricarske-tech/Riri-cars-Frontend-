import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ProtectedAdminRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-brand-bg px-6">
        <p className="text-sm font-semibold text-muted">Checking your session...</p>
      </main>
    )
  }

  if (!session) return <Navigate to="/admin" replace state={{ from: location.pathname }} />

  return children
}