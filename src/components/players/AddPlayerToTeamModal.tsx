import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Player } from '@/types/player'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllTeams } from '@/store/selectors'
import { assignPlayerToTeam } from '@/store/slices/teamsSlice'
import { canAcceptPlayer } from '@/lib/teams/team'
import { getPlayerFullName, getPlayerSubtitle } from '@/lib/players/player'
import { useToast } from '@/components/ui/useToast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { cn } from '@/lib/utils'
import { PlayerAvatar } from './PlayerAvatar'

interface AddPlayerToTeamModalProps {
  /** `null` when the modal is idle. */
  player: Player | null
  isOpen: boolean
  onClose: () => void
}

export function AddPlayerToTeamModal({ player, isOpen, onClose }: AddPlayerToTeamModalProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const allTeams = useAppSelector(selectAllTeams)

  const [selection, setSelection] = useState<{ playerId: number; teamId: string } | null>(null)

  const eligibleTeams = useMemo(
    () => (player ? allTeams.filter((team) => canAcceptPlayer(team, player.id)) : []),
    [allTeams, player]
  )

  if (!player) return null

  const selectedTeamId = selection?.playerId === player.id ? selection.teamId : null
  const isSelectionEligible = eligibleTeams.some((team) => team.id === selectedTeamId)
  const activeTeamId = isSelectionEligible ? selectedTeamId : eligibleTeams[0]?.id ?? null

  const fullName = getPlayerFullName(player)

  const handleAssign = () => {
    const destination = eligibleTeams.find((team) => team.id === activeTeamId)
    if (!destination) return

    dispatch(assignPlayerToTeam({ teamId: destination.id, playerId: player.id }))
    toast(`Added ${fullName} to ${destination.name}`, 'success')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <PlayerAvatar id={player.id} name={fullName} size="md" />
          <div>
            <DialogTitle>Add {fullName}</DialogTitle>
            <DialogDescription className="mt-0.5">
              {getPlayerSubtitle(player)}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {allTeams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                You need to create a team before assigning players.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose()
                  navigate('/teams')
                }}
              >
                Go to Teams &amp; Create
              </Button>
            </div>
          ) : eligibleTeams.length === 0 ? (
            <AlertBanner tone="warning">
              <strong className="block">No team can take this player right now.</strong>
              <span className="font-normal">
                Every team is either full or already includes them. Increase a team's capacity
                or remove players on the Teams page.
              </span>
            </AlertBanner>
          ) : (
            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Destination Team
              </p>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {eligibleTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    aria-pressed={team.id === activeTeamId}
                    onClick={() => setSelection({ playerId: player.id, teamId: team.id })}
                    className={cn(
                      'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer',
                      team.id === activeTeamId
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-muted/40'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate">{team.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {team.region}, {team.country}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground shrink-0">
                      {team.playerIds.length} / {team.playerCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {eligibleTeams.length > 0 && (
            <Button type="button" onClick={handleAssign} disabled={!activeTeamId}>
              Add Player
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
