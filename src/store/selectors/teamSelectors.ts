import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { Team } from '@/types/team'

export const selectAllTeams = (state: RootState): Team[] => state.teams.items

export const selectAssignedPlayerIds = createSelector([selectAllTeams], (teams) =>
  new Set(teams.flatMap((team) => team.playerIds))
)

/** Player id → their team. A player belongs to at most one team. */
export const selectPlayerTeamMap = createSelector([selectAllTeams], (teams) => {
  const teamByPlayerId = new Map<number, Team>()

  for (const team of teams) {
    for (const playerId of team.playerIds) {
      teamByPlayerId.set(playerId, team)
    }
  }

  return teamByPlayerId
})
