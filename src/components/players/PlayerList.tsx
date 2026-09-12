import { useCallback, useState } from 'react'
import { Loading03Icon, Search01Icon } from '@hugeicons/core-free-icons'
import type { Player } from '@/types/player'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectAllPlayers,
  selectPlayerCountries,
  selectPlayerTeamMap,
  selectPlayersError,
  selectPlayersHasMore,
  selectPlayersLoading,
  selectPlayersLoadingMore,
  selectPlayersNextCursor,
} from '@/store/selectors'
import { fetchPlayers } from '@/store/slices/playersSlice'
import { usePlayerFilters } from '@/hooks/usePlayerFilters'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Icon } from '@/components/ui/icon'
import { PlayerCard } from './PlayerCard'
import { PlayerSkeletonList } from './PlayerSkeleton'
import { PlayersToolbar } from './PlayersToolbar'
import { AddPlayerToTeamModal } from './AddPlayerToTeamModal'

export function PlayerList() {
  const dispatch = useAppDispatch()

  const players = useAppSelector(selectAllPlayers)
  const knownCountries = useAppSelector(selectPlayerCountries)
  const playerTeamMap = useAppSelector(selectPlayerTeamMap)
  const isLoading = useAppSelector(selectPlayersLoading)
  const isLoadingMore = useAppSelector(selectPlayersLoadingMore)
  const error = useAppSelector(selectPlayersError)
  const hasMore = useAppSelector(selectPlayersHasMore)
  const nextCursor = useAppSelector(selectPlayersNextCursor)

  const [playerToAssign, setPlayerToAssign] = useState<Player | null>(null)

  const filters = usePlayerFilters(players, knownCountries)

  const loadFirstPage = useCallback(() => {
    dispatch(fetchPlayers({ isInitial: true }))
  }, [dispatch])

  const loadNextPage = useCallback(() => {
    dispatch(fetchPlayers({ cursor: nextCursor }))
  }, [dispatch, nextCursor])

  const sentinelRef = useInfiniteScroll({
    enabled: hasMore && !isLoading && !isLoadingMore && !error,
    onLoadMore: loadNextPage,
  })

  if (isLoading && players.length === 0) {
    return <PlayerSkeletonList count={10} />
  }

  if (error && players.length === 0) {
    return <ErrorState title="Unable to load players" message={error} onRetry={loadFirstPage} />
  }

  return (
    <div className="space-y-5">
      <PlayersToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={filters.setSearchQuery}
        selectedCountry={filters.selectedCountry}
        onCountryChange={filters.setSelectedCountry}
        countryOptions={filters.countryOptions}
        hasActiveFilters={filters.hasActiveFilters}
        onResetFilters={filters.resetFilters}
        visibleCount={filters.filteredPlayers.length}
        totalCount={players.length}
      />

      {filters.filteredPlayers.length === 0 ? (
        <EmptyState
          title="No matching players"
          description="Try adjusting your search or country filter to find players."
          icon={Search01Icon}
          action={
            <Button onClick={filters.resetFilters} variant="outline" size="sm" className="rounded-xl">
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filters.filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              assignedTeam={playerTeamMap.get(player.id) ?? null}
              onAddToTeam={setPlayerToAssign}
            />
          ))}
        </div>
      )}

      <div
        ref={sentinelRef}
        className="py-6 flex flex-col items-center justify-center min-h-[60px]"
      >
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon icon={Loading03Icon} className="h-4 w-4 animate-spin text-primary" />
            <span>Fetching more players...</span>
          </div>
        )}

        {error && players.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-destructive">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={loadNextPage} className="h-8 rounded-lg text-xs">
              Retry
            </Button>
          </div>
        )}

        {!hasMore && players.length > 0 && (
          <div className="text-center text-xs text-muted-foreground border-t border-border/50 pt-4 w-full">
            {players.length} players loaded
          </div>
        )}
      </div>

      <AddPlayerToTeamModal
        player={playerToAssign}
        isOpen={playerToAssign !== null}
        onClose={() => setPlayerToAssign(null)}
      />
    </div>
  )
}
