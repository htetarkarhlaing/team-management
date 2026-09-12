import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { SearchInput } from '@/components/ui/SearchInput'
import { SelectField, type SelectOption } from '@/components/ui/SelectField'
import { COUNTRY_FILTER_ALL } from '@/lib/constants'

interface PlayersToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCountry: string
  onCountryChange: (value: string) => void
  countryOptions: string[]
  hasActiveFilters: boolean
  onResetFilters: () => void
  visibleCount: number
  totalCount: number
}

interface FilterChipProps {
  label: string
  onClear: () => void
}

function FilterChip({ label, onClear }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Remove filter ${label}`}
      className="inline-flex items-center gap-1 font-medium text-primary bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
    >
      <span>{label}</span>
      <Icon icon={Cancel01Icon} className="h-3 w-3 text-primary/70" />
    </button>
  )
}

export function PlayersToolbar({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  countryOptions,
  hasActiveFilters,
  onResetFilters,
  visibleCount,
  totalCount,
}: PlayersToolbarProps) {
  const countrySelectOptions: SelectOption[] = [
    { value: COUNTRY_FILTER_ALL, label: 'All Countries' },
    ...countryOptions.map((country) => ({ value: country, label: country })),
  ]

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          label="Search players"
          placeholder="Search players by name, country or position..."
          className="flex-1"
        />

        <SelectField
          value={selectedCountry}
          onChange={onCountryChange}
          options={countrySelectOptions}
          label="Filter by country"
          className="min-w-[140px] flex-1 sm:flex-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
        <span>
          <strong className="text-foreground font-semibold">{visibleCount}</strong> of{' '}
          {totalCount} players
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {selectedCountry !== COUNTRY_FILTER_ALL && (
            <FilterChip
              label={selectedCountry}
              onClear={() => onCountryChange(COUNTRY_FILTER_ALL)}
            />
          )}

          {searchQuery.trim() && (
            <FilterChip
              label={`"${searchQuery.trim()}"`}
              onClear={() => onSearchChange('')}
            />
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  )
}

