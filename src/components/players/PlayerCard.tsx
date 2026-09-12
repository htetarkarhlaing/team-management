import { memo } from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import type { Player } from '@/types/player'
import type { Team } from '@/types/team'
import {
  PlusSignIcon,
  CheckmarkCircle02Icon,
  BirthdayCakeIcon,
  RulerIcon,
  WeightScale01Icon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import {
  formatPlayerWeight,
  getPlayerCountry,
  getPlayerFullName,
} from '@/lib/players/player'
import { cn } from '@/lib/utils'
import { PlayerAvatar } from './PlayerAvatar'

interface PlayerCardProps {
  player: Player
  assignedTeam: Team | null
  onAddToTeam: (player: Player) => void
}

interface PlayerStatProps {
  icon: IconSvgElement
  label: string
  value: string
  className?: string
}

const EMPTY_STAT = '—'

function PlayerStat({ icon, label, value, className }: PlayerStatProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Icon icon={icon} className="h-3 w-3 text-muted-foreground/70" />
        <span>{label}</span>
      </div>
      <span className="text-xs font-bold text-foreground mt-0.5 truncate max-w-full">
        {value}
      </span>
    </div>
  )
}


export const PlayerCard = memo(function PlayerCard({
  player,
  assignedTeam,
  onAddToTeam,
}: PlayerCardProps) {
  const fullName = getPlayerFullName(player)
  const country = getPlayerCountry(player, 'International')

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <PlayerAvatar id={player.id} name={fullName} size="lg" />

          {player.position && (
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100/80 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
              {player.position}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground mt-3 truncate" title={fullName}>
          {fullName}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 truncate">{country}</p>

        <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-border/50 text-center">
          <PlayerStat
            icon={BirthdayCakeIcon}
            label="Age"
            value={player.age?.toString() ?? EMPTY_STAT}
          />
          <PlayerStat
            icon={RulerIcon}
            label="Height"
            value={player.height || EMPTY_STAT}
            className="border-x border-border/40 px-1"
          />
          <PlayerStat
            icon={WeightScale01Icon}
            label="Weight"
            value={formatPlayerWeight(player) ?? EMPTY_STAT}
          />
        </div>
      </div>

      <div className="mt-4 pt-1">
        {assignedTeam ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onAddToTeam(player)}
            className="w-full h-10 rounded-xl bg-emerald-50 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100 hover:text-emerald-800 font-semibold text-xs gap-1.5 px-2 cursor-pointer shadow-2xs"
            title={`Assigned to ${assignedTeam.name}. Click to change.`}
          >
            <Icon icon={CheckmarkCircle02Icon} className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">{assignedTeam.name}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => onAddToTeam(player)}
            className="w-full h-10 rounded-xl font-semibold text-xs shadow-xs gap-1.5 cursor-pointer"
          >
            <Icon icon={PlusSignIcon} className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Add to Team</span>
          </Button>
        )}
      </div>
    </div>
  )
})
