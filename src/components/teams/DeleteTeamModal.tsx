import type { Team } from '@/types/team'
import { useAppDispatch } from '@/store/hooks'
import { deleteTeam } from '@/store/slices/teamsSlice'
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

interface DeleteTeamModalProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
}

export function DeleteTeamModal({ team, isOpen, onClose }: DeleteTeamModalProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  if (!team) return null

  const assignedCount = team.playerIds.length

  const handleConfirmDelete = () => {
    dispatch(deleteTeam(team.id))
    toast(`${team.name} deleted.`, 'info')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <strong className="text-foreground">"{team.name}"</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm text-muted-foreground space-y-2">
          {assignedCount > 0 ? (
            <AlertBanner tone="warning">
              <strong>
                {assignedCount} player{assignedCount === 1 ? '' : 's'}
              </strong>{' '}
              assigned to this team will become available to other teams.
            </AlertBanner>
          ) : (
            <p className="text-xs">This team has no assigned players.</p>
          )}
          <p className="text-xs">This action cannot be undone.</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
            Delete Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
