import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated, selectIsHydrated } from '@/store/selectors'
import { useEnsurePlayersLoaded } from '@/hooks/useEnsurePlayersLoaded'
import { ROUTES } from '../routes/paths'
import { AppHeader } from './AppHeader'

export function ProtectedLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isHydrated = useAppSelector(selectIsHydrated)
  const location = useLocation()

  useEnsurePlayersLoaded()

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          role="status"
          aria-label="Loading session"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}
