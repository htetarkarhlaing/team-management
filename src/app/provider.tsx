import { type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import { ErrorBoundary } from '@/components/common/error-boundary'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </ErrorBoundary>
  )
}
