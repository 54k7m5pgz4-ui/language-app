import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import LoadingSpinner from './ui/LoadingSpinner'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized, loading } = useAuthStore()
  const location = useLocation()

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
