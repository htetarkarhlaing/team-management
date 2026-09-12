import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated, selectIsHydrated } from '@/store/selectors'
import { ROUTES } from './paths'

export function RootRedirect() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isHydrated = useAppSelector(selectIsHydrated)

  if (!isHydrated) return null

  return <Navigate to={isAuthenticated ? ROUTES.players : ROUTES.login} replace />
}
