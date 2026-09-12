import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UserGroupIcon,
  Location01Icon,
  Globe02Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { teamSchema, type TeamFormData } from '@/lib/validation/teamSchema'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { FormField } from '@/components/ui/FormField'
import { IconInput } from '@/components/ui/IconInput'
import { AlertBanner } from '@/components/ui/AlertBanner'

interface TeamFormProps {
  onSubmit: (data: TeamFormData) => void
  onCancel: () => void
  defaultValues?: Partial<TeamFormData>
  submitLabel?: string
  assignedCount?: number
  externalError?: string | null
}

const DEFAULT_PLAYER_COUNT = 5

export function TeamForm({
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = 'Create Team',
  assignedCount = 0,
  externalError,
}: TeamFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      playerCount: defaultValues?.playerCount ?? DEFAULT_PLAYER_COUNT,
      region: defaultValues?.region ?? '',
      country: defaultValues?.country ?? '',
    },
  })

  const handleValidSubmit = (data: TeamFormData) => {
    if (data.playerCount < assignedCount) {
      setError('playerCount', {
        type: 'manual',
        message: `Capacity cannot be lower than the ${assignedCount} player${
          assignedCount === 1 ? '' : 's'
        } already assigned. Remove players first.`,
      })
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4 py-1 text-left">
      {externalError && <AlertBanner>{externalError}</AlertBanner>}

      <FormField htmlFor="team-name" label="Team Name" required error={errors.name?.message}>
        <IconInput
          id="team-name"
          type="text"
          icon={UserGroupIcon}
          placeholder="e.g. Bangkok Warriors"
          autoFocus
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
      </FormField>

      <FormField
        htmlFor="player-count"
        label="Player Count (Max Capacity)"
        required
        error={errors.playerCount?.message}
        hint={
          assignedCount > 0
            ? `${assignedCount} player${assignedCount === 1 ? '' : 's'} assigned — capacity must be at least ${assignedCount}.`
            : undefined
        }
      >
        <IconInput
          id="player-count"
          type="number"
          icon={UserGroupIcon}
          min={1}
          max={50}
          placeholder={String(DEFAULT_PLAYER_COUNT)}
          aria-invalid={Boolean(errors.playerCount)}
          {...register('playerCount', { valueAsNumber: true })}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <FormField htmlFor="region" label="Region" required error={errors.region?.message}>
          <IconInput
            id="region"
            type="text"
            icon={Location01Icon}
            placeholder="e.g. Bangkok"
            aria-invalid={Boolean(errors.region)}
            {...register('region')}
          />
        </FormField>

        <FormField htmlFor="country" label="Country" required error={errors.country?.message}>
          <IconInput
            id="country"
            type="text"
            icon={Globe02Icon}
            placeholder="e.g. Thailand"
            aria-invalid={Boolean(errors.country)}
            {...register('country')}
          />
        </FormField>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-10 px-4 rounded-xl font-medium text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-5 rounded-xl font-semibold text-xs shadow-xs gap-1.5"
        >
          <Icon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.5} />
          <span>{submitLabel}</span>
        </Button>
      </div>
    </form>
  )
}
