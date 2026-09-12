import type { RootState } from '@/store'

export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUsername = (state: RootState) => state.auth.username

/** False until the persisted session has been read; routes wait on this. */
export const selectIsHydrated = (state: RootState) => state.auth.isHydrated
