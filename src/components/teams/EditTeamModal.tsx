import type { Team } from '@/types/team'
import { useAppDispatch } from '@/store/hooks'
import { updateTeam } from '@/store/slices/teamsSlice'
import { useToast } from '@/components/ui/useToast'
import type { TeamFormData } from '@/lib/validation/teamSchema'
import { TeamFormDialog } from './TeamFormDialog'

interface EditTeamModalProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
}

export function EditTeamModal({ team, isOpen, onClose }: EditTeamModalProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  if (!team) return null

  const handleSubmit = (data: TeamFormData) => {
    dispatch(updateTeam({ id: team.id, ...data }))
    toast(`Team "${data.name.trim()}" updated.`, 'success')
    onClose()
  }

  return (
    <TeamFormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Team: ${team.name}`}
      description="Edit team details"
      submitLabel="Save Changes"
      editingTeamId={team.id}
      assignedCount={team.playerIds.length}
      defaultValues={{
        name: team.name,
        playerCount: team.playerCount,
        region: team.region,
        country: team.country,
      }}
      onValidSubmit={handleSubmit}
    />
  )
}
