import { useCallback, useMemo, useState } from "react";
import type { Player } from "@/types/player";
import {
  getFilterableCountry,
  getPlayerCountry,
  matchesPlayerSearch,
} from "@/lib/players/player";
import { COUNTRY_FILTER_ALL } from "@/lib/constants";

export function usePlayerFilters(players: Player[], knownCountries: string[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<string>(COUNTRY_FILTER_ALL);

  const countryOptions = useMemo(() => {
    const countries = new Set(knownCountries);

    for (const player of players) {
      const country = getFilterableCountry(player);
      if (country) countries.add(country);
    }

    return Array.from(countries).sort();
  }, [knownCountries, players]);

  const filteredPlayers = useMemo(() => {
    return players.filter(
      (player) =>
        matchesPlayerSearch(player, searchQuery) &&
        (selectedCountry === COUNTRY_FILTER_ALL ||
          getPlayerCountry(player) === selectedCountry),
    );
  }, [players, searchQuery, selectedCountry]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCountry !== COUNTRY_FILTER_ALL;

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCountry(COUNTRY_FILTER_ALL);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    countryOptions,
    filteredPlayers,
    hasActiveFilters,
    resetFilters,
  };
}

