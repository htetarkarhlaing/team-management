import type { Team } from '@/types/team'
import type { PersistedAuth } from '@/types/auth'
import { STORAGE_KEY_APP_STATE } from '@/lib/constants'
import { readJson, writeJson } from '@/lib/storage/localStorage'

/** Players are re-fetched on every visit, so only auth and teams persist. */
export interface PersistedState {
  auth: PersistedAuth
  teams: Team[]
}

/** Normalises anything malformed to safe defaults. */
export function loadPersistedState(): PersistedState | undefined {
  const stored = readJson<Partial<PersistedState>>(STORAGE_KEY_APP_STATE)
  if (!stored) return undefined

  return {
    auth: {
      username: stored.auth?.username ?? null,
      isAuthenticated: Boolean(stored.auth?.isAuthenticated),
    },
    teams: Array.isArray(stored.teams) ? stored.teams : [],
  }
}

/** Failures are silent: persistence is best-effort. */
export function savePersistedState(state: PersistedState): void {
  writeJson(STORAGE_KEY_APP_STATE, state)
}
