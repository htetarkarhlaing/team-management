import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { Player } from '@/types/player'
import { selectAssignedPlayerIds } from './teamSelectors'

export const selectAllPlayers = (state: RootState): Player[] => state.players.items
export const selectPlayersLoading = (state: RootState) => state.players.loading
export const selectPlayersLoadingMore = (state: RootState) => state.players.loadingMore
export const selectPlayersError = (state: RootState) => state.players.error
export const selectPlayersHasMore = (state: RootState) => state.players.hasMore
export const selectPlayersNextCursor = (state: RootState) => state.players.nextCursor
export const selectPlayerCountries = (state: RootState): string[] => state.players.countries

/** Loaded players that do not yet belong to any team. */
export const selectAvailablePlayers = createSelector(
  [selectAllPlayers, selectAssignedPlayerIds],
  (players, assignedIds) => players.filter((player) => !assignedIds.has(player.id))
)
