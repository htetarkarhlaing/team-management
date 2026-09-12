import { memo } from 'react'
import { Edit02Icon, Delete02Icon, UserMultipleIcon } from '@hugeicons/core-free-icons'
import type { Team } from '@/types/team'
import {
  getCapacityPercentage,
  getRemainingCapacity,
  isTeamFull,
} from '@/lib/teams/team'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface TeamCardProps {
  team: Team
  onManagePlayers: (team: Team) => void
  onEdit: (team: Team) => void
  onDelete: (team: Team) => void
}

export const TeamCard = memo(function TeamCard({
  team,
  onManagePlayers,
  onEdit,
  onDelete,
}: TeamCardProps) {
  const assignedCount = team.playerIds.length
  const isFull = isTeamFull(team)

  return (
    <Card className="flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all group">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {team.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1">
              {team.region}, {team.country}
            </CardDescription>
          </div>

          <Badge variant={isFull ? 'success' : 'secondary'} className="text-xs shrink-0 font-medium">
            {isFull ? 'Full Squad' : `${getRemainingCapacity(team)} Open`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1">
        <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40 space-y-2 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Roster Capacity</span>
            <span className="font-bold text-foreground font-mono">
              {assignedCount} / {team.playerCount}
            </span>
          </div>

          <div
            className="w-full h-2 rounded-full bg-border overflow-hidden"
            role="progressbar"
            aria-label={`${team.name} roster capacity`}
            aria-valuenow={assignedCount}
            aria-valuemin={0}
            aria-valuemax={team.playerCount}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                isFull ? 'bg-emerald-600' : 'bg-primary'
              )}
              style={{ width: `${getCapacityPercentage(team)}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/40 mt-3 flex flex-wrap items-center justify-between gap-2">
        <Button
          size="sm"
          onClick={() => onManagePlayers(team)}
          className="text-xs font-semibold gap-1.5 h-9 flex-1 shadow-sm cursor-pointer"
        >
          <Icon icon={UserMultipleIcon} className="h-3.5 w-3.5" />
          <span>Manage Players</span>
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(team)}
            className="text-xs h-9 px-2.5 cursor-pointer"
            aria-label={`Edit ${team.name}`}
            title={`Edit ${team.name}`}
          >
            <Icon icon={Edit02Icon} className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(team)}
            className="text-xs h-9 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            aria-label={`Delete ${team.name}`}
            title={`Delete ${team.name}`}
          >
            <Icon icon={Delete02Icon} className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
})
