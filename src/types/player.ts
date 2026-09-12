export interface Player {
  id: number
  first_name: string
  last_name: string
  display_name?: string
  short_name?: string
  position?: string
  height?: string | null
  weight?: string | null
  citizenship?: string | null
  country?: string | null
  age?: number | null
  date_of_birth?: string | null
}

export interface PlayersPaginationMeta {
  prev_cursor?: number
  next_cursor?: number | null
  per_page: number
}

export interface PlayersApiResponse {
  data: Player[]
  meta: PlayersPaginationMeta
}
