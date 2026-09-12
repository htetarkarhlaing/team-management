import { useState } from 'react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { TeamList } from '@/components/teams/TeamList'
import { CreateTeamModal } from '@/components/teams/CreateTeamModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

export function TeamsRoute() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Teams"
        action={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-xs font-semibold h-10 px-4 rounded-xl cursor-pointer"
          >
            <Icon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.5} />
            <span>Create Team</span>
          </Button>
        }
      />

      <TeamList onCreateTeam={() => setIsCreateOpen(true)} />

      <CreateTeamModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
