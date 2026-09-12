import type { ReactNode } from 'react'
import type { Player } from '@/types/player'
import { getPlayerFullName, getPlayerSubtitle } from '@/lib/players/player'
import { PlayerAvatar } from './PlayerAvatar'

interface PlayerListItemProps {
  player: Player
  action: ReactNode
}

export function PlayerListItem({ player, action }: PlayerListItemProps) {
  const fullName = getPlayerFullName(player)

  return (
    <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <PlayerAvatar id={player.id} name={fullName} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{getPlayerSubtitle(player)}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
