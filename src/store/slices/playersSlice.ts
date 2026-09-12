import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Player } from '@/types/player'
import { getPlayers } from '@/lib/api/players'
import { getFilterableCountry } from '@/lib/players/player'

/** `loading` covers the first page (skeletons); `loadingMore` the rest. */
export interface PlayersState {
  items: Player[]
  /** Every distinct country seen so far, sorted, for the country filter. */
  countries: string[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  nextCursor: number | null
  hasMore: boolean
}

export interface FetchPlayersArgs {
  cursor?: number | null
  /** True to replace the list rather than append to it. */
  isInitial?: boolean
}

const initialState: PlayersState = {
  items: [],
  countries: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextCursor: null,
  hasMore: true,
}

export const fetchPlayers = createAsyncThunk<
  { players: Player[]; nextCursor: number | null; isInitial: boolean },
  FetchPlayersArgs | undefined,
  { rejectValue: string }
>('players/fetchPlayers', async (args = {}, { rejectWithValue }) => {
  try {
    const { data, meta } = await getPlayers({ cursor: args.cursor })

    return {
      players: data,
      nextCursor: meta.next_cursor ?? null,
      isInitial: Boolean(args.isInitial),
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch players.'
    )
  }
})

function mergeCountries(existing: string[], players: Player[]): string[] {
  const countries = new Set(existing)

  for (const player of players) {
    const country = getFilterableCountry(player)
    if (country) countries.add(country)
  }

  return Array.from(countries).sort()
}

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearPlayersError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state, action) => {
        state.error = null

        const isFirstPage = action.meta.arg?.isInitial || state.items.length === 0
        state.loading = isFirstPage
        state.loadingMore = !isFirstPage
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        const { players, nextCursor, isInitial } = action.payload

        state.loading = false
        state.loadingMore = false
        state.error = null

        if (isInitial || state.items.length === 0) {
          state.items = players
        } else {
          // The API can repeat records across pages; keep the first copy seen.
          const knownIds = new Set(state.items.map((player) => player.id))
          state.items.push(...players.filter((player) => !knownIds.has(player.id)))
        }

        state.countries = mergeCountries(state.countries, players)
        state.nextCursor = nextCursor
        state.hasMore = nextCursor !== null && players.length > 0
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false
        state.loadingMore = false
        state.error = action.payload ?? action.error.message ?? 'Unable to load players.'
      })
  },
})

export const { clearPlayersError } = playersSlice.actions
export default playersSlice.reducer
