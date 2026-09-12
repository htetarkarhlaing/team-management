import { useState } from 'react'
import { Layers01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import type { Team } from '@/types/team'
import { useAppSelector } from '@/store/hooks'
import { selectAllTeams } from '@/store/selectors'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/icon'
import { TeamCard } from './TeamCard'
import { EditTeamModal } from './EditTeamModal'
import { DeleteTeamModal } from './DeleteTeamModal'
import { ManagePlayersModal } from './ManagePlayersModal'

interface TeamListProps {
  onCreateTeam: () => void
}

export function TeamList({ onCreateTeam }: TeamListProps) {
  const teams = useAppSelector(selectAllTeams)

  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null)
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
  const [teamToManage, setTeamToManage] = useState<Team | null>(null)

  return (
    <>
      {teams.length === 0 ? (
        <EmptyState
          title="No teams created yet"
          description="Create your first custom team to start assigning and managing players."
          icon={Layers01Icon}
          action={
            <Button onClick={onCreateTeam} className="gap-2 font-semibold cursor-pointer">
              <Icon icon={PlusSignIcon} className="h-4 w-4" />
              <span>Create your first team</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onManagePlayers={setTeamToManage}
              onEdit={setTeamToEdit}
              onDelete={setTeamToDelete}
            />
          ))}
        </div>
      )}

      <EditTeamModal
        team={teamToEdit}
        isOpen={teamToEdit !== null}
        onClose={() => setTeamToEdit(null)}
      />
      <DeleteTeamModal
        team={teamToDelete}
        isOpen={teamToDelete !== null}
        onClose={() => setTeamToDelete(null)}
      />
      <ManagePlayersModal
        team={teamToManage}
        isOpen={teamToManage !== null}
        onClose={() => setTeamToManage(null)}
      />
    </>
  )
}
