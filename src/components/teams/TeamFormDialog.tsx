import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllTeams } from '@/store/selectors'
import { isTeamNameTaken } from '@/lib/teams/team'
import type { TeamFormData } from '@/lib/validation/teamSchema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { TeamForm } from './TeamForm'

interface TeamFormDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  submitLabel: string
  onValidSubmit: (data: TeamFormData) => void
  defaultValues?: Partial<TeamFormData>
  editingTeamId?: string
  assignedCount?: number
}

export function TeamFormDialog({
  isOpen,
  onClose,
  title,
  description,
  submitLabel,
  onValidSubmit,
  defaultValues,
  editingTeamId,
  assignedCount = 0,
}: TeamFormDialogProps) {
  const allTeams = useAppSelector(selectAllTeams)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)

  const handleClose = () => {
    setDuplicateError(null)
    onClose()
  }

  const handleSubmit = (data: TeamFormData) => {
    const name = data.name.trim()

    if (isTeamNameTaken(allTeams, name, editingTeamId)) {
      setDuplicateError(`A team named "${name}" already exists. Please choose a unique name.`)
      return
    }

    setDuplicateError(null)
    onValidSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>

        <TeamForm
          defaultValues={defaultValues}
          assignedCount={assignedCount}
          submitLabel={submitLabel}
          externalError={duplicateError}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}
