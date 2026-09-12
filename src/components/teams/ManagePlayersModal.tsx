import { useMemo, useState, type ReactNode } from 'react'
import {
  PlusSignIcon,
  Delete02Icon,
  UserGroupIcon,
  UserAdd01Icon,
} from '@hugeicons/core-free-icons'
import type { Player } from '@/types/player'
import type { Team } from '@/types/team'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllPlayers, selectAvailablePlayers } from '@/store/selectors'
import { assignPlayerToTeam, removePlayerFromTeam } from '@/store/slices/teamsSlice'
import { isTeamFull } from '@/lib/teams/team'
import { getPlayerFullName, matchesPlayerSearch } from '@/lib/players/player'
import { useToast } from '@/components/ui/useToast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { SearchInput } from '@/components/ui/SearchInput'
import { SegmentedTabs, type SegmentedTab } from '@/components/ui/SegmentedTabs'
import { PlayerListItem } from '@/components/players/PlayerListItem'

interface ManagePlayersModalProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
}

type SquadTab = 'assigned' | 'add'

export function ManagePlayersModal({ team, isOpen, onClose }: ManagePlayersModalProps) {
  if (!team) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-xl">
        <ManageSquadPanel key={team.id} team={team} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

function PlayerRoster({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-card overflow-hidden">
      {children}
    </div>
  )
}

function EmptyPanel({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2">
      {children}
    </div>
  )
}

interface ManageSquadPanelProps {
  team: Team
  onClose: () => void
}

function ManageSquadPanel({ team, onClose }: ManageSquadPanelProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const allPlayers = useAppSelector(selectAllPlayers)
  const availablePlayers = useAppSelector(selectAvailablePlayers)

  const [activeTab, setActiveTab] = useState<SquadTab>('assigned')
  const [searchQuery, setSearchQuery] = useState('')

  const assignedPlayers = useMemo(() => {
    const assignedIds = new Set(team.playerIds)
    return allPlayers.filter((player) => assignedIds.has(player.id))
  }, [team.playerIds, allPlayers])

  const matchingAvailablePlayers = useMemo(
    () => availablePlayers.filter((player) => matchesPlayerSearch(player, searchQuery)),
    [availablePlayers, searchQuery]
  )

  const isFull = isTeamFull(team)

  const handleAddPlayer = (player: Player) => {
    dispatch(assignPlayerToTeam({ teamId: team.id, playerId: player.id }))
    toast(`Added ${getPlayerFullName(player)} to ${team.name}`, 'success')
  }

  const handleRemovePlayer = (player: Player) => {
    dispatch(removePlayerFromTeam({ teamId: team.id, playerId: player.id }))
    toast(`Removed ${getPlayerFullName(player)} from ${team.name}`, 'info')
  }

  const tabs: SegmentedTab<SquadTab>[] = [
    { value: 'assigned', label: `Assigned Squad (${assignedPlayers.length})`, icon: UserGroupIcon },
    { value: 'add', label: `Add Players (${matchingAvailablePlayers.length})`, icon: UserAdd01Icon },
  ]

  return (
    <>
      <div className="p-6 pb-4 border-b border-border/70 bg-card">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Manage Squad — {team.name}
            </DialogTitle>
            <Badge variant={isFull ? 'success' : 'secondary'} className="text-xs font-semibold">
              {team.playerIds.length} / {team.playerCount} Players
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Region: {team.region}, {team.country} • Max capacity: {team.playerCount} players
          </DialogDescription>
        </DialogHeader>

        <SegmentedTabs
          tabs={tabs}
          value={activeTab}
          onChange={setActiveTab}
          label="Squad management tabs"
          className="mt-4"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {activeTab === 'assigned' &&
          (assignedPlayers.length === 0 ? (
            <EmptyPanel>
              <p className="text-sm font-medium text-foreground">No players assigned yet</p>
              <p className="text-xs text-muted-foreground">
                Switch to the "Add Players" tab to assign players to this squad.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('add')}
                className="mt-2 text-xs cursor-pointer"
              >
                Browse Available Players
              </Button>
            </EmptyPanel>
          ) : (
            <PlayerRoster>
              {assignedPlayers.map((player) => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePlayer(player)}
                      className="text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/30 h-8 gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Icon icon={Delete02Icon} className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </Button>
                  }
                />
              ))}
            </PlayerRoster>
          ))}

        {activeTab === 'add' && (
          <>
            {isFull && (
              <AlertBanner tone="success" className="flex items-center justify-between gap-3">
                <span>
                  <strong className="block">
                    Team is at full capacity ({team.playerCount}/{team.playerCount})
                  </strong>
                  Remove players from the "Assigned Squad" tab to free up roster spots.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('assigned')}
                  className="shrink-0 text-xs border-emerald-300 bg-white hover:bg-emerald-100 cursor-pointer"
                >
                  View Squad
                </Button>
              </AlertBanner>
            )}

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              label="Filter available players"
              placeholder="Filter available players by name, position or country..."
            />

            {matchingAvailablePlayers.length === 0 ? (
              <EmptyPanel>
                <p className="text-xs font-semibold text-foreground">No available players found</p>
                <p className="text-xs text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your filter.'
                    : 'All currently loaded players are already assigned to teams.'}
                </p>
              </EmptyPanel>
            ) : (
              <PlayerRoster>
                {matchingAvailablePlayers.map((player) => (
                  <PlayerListItem
                    key={player.id}
                    player={player}
                    action={
                      <Button
                        type="button"
                        size="sm"
                        disabled={isFull}
                        onClick={() => handleAddPlayer(player)}
                        className="text-xs h-8 px-3 gap-1.5 shrink-0 shadow-xs cursor-pointer"
                      >
                        <Icon icon={PlusSignIcon} className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    }
                  />
                ))}
              </PlayerRoster>
            )}
          </>
        )}
      </div>

      <div className="p-4 px-6 border-t border-border/70 bg-muted/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Capacity:{' '}
          <strong className="text-foreground">
            {team.playerIds.length} / {team.playerCount}
          </strong>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-xl px-4 cursor-pointer"
        >
          Done
        </Button>
      </div>
    </>
  )
}
