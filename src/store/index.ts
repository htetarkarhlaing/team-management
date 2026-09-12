import { configureStore } from '@reduxjs/toolkit'
import authReducer, { setHydrated } from './slices/authSlice'
import teamsReducer, { setTeamsFromStorage } from './slices/teamsSlice'
import playersReducer from './slices/playersSlice'
import { loadPersistedState, savePersistedState } from './persistence/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer,
    players: playersReducer,
  },
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// `setHydrated` runs even with nothing stored: the routes wait on
// `auth.isHydrated` before deciding whether to redirect to the login page.
function hydrateStore(): void {
  const persisted = loadPersistedState()

  store.dispatch(setHydrated(persisted?.auth))

  if (persisted?.teams.length) {
    store.dispatch(setTeamsFromStorage(persisted.teams))
  }
}

// Slice references are compared first so unrelated actions — player fetches
// in particular — do not trigger a serialise-and-write on every page.
function subscribeToPersistence(): void {
  let previousAuth = store.getState().auth
  let previousTeams = store.getState().teams

  store.subscribe(() => {
    const { auth, teams } = store.getState()
    if (auth === previousAuth && teams === previousTeams) return

    previousAuth = auth
    previousTeams = teams

    savePersistedState({
      auth: { username: auth.username, isAuthenticated: auth.isAuthenticated },
      teams: teams.items,
    })
  })
}

hydrateStore()
subscribeToPersistence()
