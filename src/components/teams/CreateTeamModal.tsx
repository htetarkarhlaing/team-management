import { useAppDispatch } from '@/store/hooks'
import { createTeam } from '@/store/slices/teamsSlice'
import { useToast } from '@/components/ui/useToast'
import type { TeamFormData } from '@/lib/validation/teamSchema'
import { TeamFormDialog } from './TeamFormDialog'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleSubmit = (data: TeamFormData) => {
    dispatch(createTeam(data))
    toast(`Team "${data.name.trim()}" created successfully.`, 'success')
    onClose()
  }

  return (
    <TeamFormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Team"
      description="Create team form"
      submitLabel="Create Team"
      onValidSubmit={handleSubmit}
    />
  )
}
