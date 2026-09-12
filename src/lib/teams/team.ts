import type { Team } from '@/types/team'

// Shared by the store, the forms and the modals, so the UI previews a rule
// (disabled button, warning) with the same logic the reducer enforces.

export function getRemainingCapacity(team: Team): number {
  return Math.max(0, team.playerCount - team.playerIds.length)
}

export function isTeamFull(team: Team): boolean {
  return team.playerIds.length >= team.playerCount
}

/** Clamped to 0–100, for progress bars. */
export function getCapacityPercentage(team: Team): number {
  if (team.playerCount <= 0) return 0

  return Math.min(100, (team.playerIds.length / team.playerCount) * 100)
}

/** Has room and does not already hold this player. */
export function canAcceptPlayer(team: Team, playerId: number): boolean {
  return !isTeamFull(team) && !team.playerIds.includes(playerId)
}

/** Case-insensitive. `excludeTeamId` skips the team being renamed. */
export function isTeamNameTaken(
  teams: Team[],
  name: string,
  excludeTeamId?: string
): boolean {
  const normalized = name.trim().toLowerCase()

  return teams.some(
    (team) =>
      team.id !== excludeTeamId && team.name.trim().toLowerCase() === normalized
  )
}
