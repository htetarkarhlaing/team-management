import { PlayerList } from '@/components/players/PlayerList'
import { PageHeader } from '@/components/ui/PageHeader'

export function PlayersRoute() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Players" />
      <PlayerList />
    </div>
  )
}
