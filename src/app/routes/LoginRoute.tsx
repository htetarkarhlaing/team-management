import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated, selectIsHydrated } from '@/store/selectors'
import { BrandMark } from '@/components/ui/BrandMark'
import { SegmentedTabs, type SegmentedTab } from '@/components/ui/SegmentedTabs'
import { ROUTES } from './paths'

type AuthMode = 'login' | 'register'

const AUTH_TABS: SegmentedTab<AuthMode>[] = [
  { value: 'login', label: 'Sign In' },
  { value: 'register', label: 'Create Account' },
]

export function LoginRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isHydrated = useAppSelector(selectIsHydrated)
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  if (isHydrated && isAuthenticated) {
    return <Navigate to={ROUTES.players} replace />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandMark size="lg" className="mb-1" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Team Manager
          </h1>
        </div>

        <div className="bg-card border border-border/60 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
          <SegmentedTabs
            tabs={AUTH_TABS}
            value={authMode}
            onChange={setAuthMode}
            label="Authentication mode"
          />

          {authMode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
