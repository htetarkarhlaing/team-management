import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/toast'
import { ROUTES } from './routes/paths'
import { RootRedirect } from './routes/RootRedirect'
import { LoginRoute } from './routes/LoginRoute'
import { PlayersRoute } from './routes/PlayersRoute'
import { TeamsRoute } from './routes/TeamsRoute'
import { ProtectedLayout } from './layout/ProtectedLayout'

/** Everything under `ProtectedLayout` requires an authenticated session. */
export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.root} element={<RootRedirect />} />
          <Route path={ROUTES.login} element={<LoginRoute />} />

          <Route element={<ProtectedLayout />}>
            <Route path={ROUTES.players} element={<PlayersRoute />} />
            <Route path={ROUTES.teams} element={<TeamsRoute />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
