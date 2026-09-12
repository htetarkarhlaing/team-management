import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Team } from '@/types/team'
import { createId } from '@/lib/id'
import { isTeamFull } from '@/lib/teams/team'

export interface TeamDetails {
  name: string
  region: string
  country: string
  playerCount: number
}

export interface TeamsState {
  items: Team[]
}

const initialState: TeamsState = {
  items: [],
}

function trimDetails(details: TeamDetails) {
  return {
    name: details.name.trim(),
    region: details.region.trim(),
    country: details.country.trim(),
    playerCount: details.playerCount,
  }
}

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeamsFromStorage: (state, action: PayloadAction<Team[]>) => {
      state.items = action.payload
    },

    createTeam: {
      reducer: (state, action: PayloadAction<Team>) => {
        state.items.push(action.payload)
      },
      prepare: (details: TeamDetails) => {
        const now = new Date().toISOString()

        return {
          payload: {
            id: createId('team'),
            ...trimDetails(details),
            playerIds: [],
            createdAt: now,
            updatedAt: now,
          } satisfies Team,
        }
      },
    },

    updateTeam: (state, action: PayloadAction<TeamDetails & { id: string }>) => {
      const team = state.items.find((candidate) => candidate.id === action.payload.id)
      if (!team) return

      Object.assign(team, trimDetails(action.payload))
      team.updatedAt = new Date().toISOString()
    },

    deleteTeam: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((team) => team.id !== action.payload)
    },

    // A player belongs to at most one team, so they are removed from any
    // other team first. Rejected outright when the destination is full.
    assignPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) => {
      const { teamId, playerId } = action.payload

      const destination = state.items.find((team) => team.id === teamId)
      if (!destination || destination.playerIds.includes(playerId)) return
      if (isTeamFull(destination)) return

      const now = new Date().toISOString()

      for (const team of state.items) {
        if (!team.playerIds.includes(playerId)) continue

        team.playerIds = team.playerIds.filter((id) => id !== playerId)
        team.updatedAt = now
      }

      destination.playerIds.push(playerId)
      destination.updatedAt = now
    },

    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) => {
      const { teamId, playerId } = action.payload

      const team = state.items.find((candidate) => candidate.id === teamId)
      if (!team) return

      team.playerIds = team.playerIds.filter((id) => id !== playerId)
      team.updatedAt = new Date().toISOString()
    },
  },
})

export const {
  setTeamsFromStorage,
  createTeam,
  updateTeam,
  deleteTeam,
  assignPlayerToTeam,
  removePlayerFromTeam,
} = teamsSlice.actions

export default teamsSlice.reducer
