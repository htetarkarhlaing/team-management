import type { Player } from "@/types/player";

/** Value the API uses when a player's country is not known. */
export const UNKNOWN_COUNTRY = "Unknown";

export function getPlayerFullName(player: Player): string {
  const displayName = player.display_name?.trim();
  if (displayName) return displayName;

  return `${player.first_name} ${player.last_name}`.trim();
}

/** `citizenship` is the more specific field and wins when present. */
export function getPlayerCountry(player: Player, fallback = ""): string {
  return player.citizenship?.trim() || player.country?.trim() || fallback;
}

/** Returns null when the country is unknown, so filters can skip it. */
export function getFilterableCountry(player: Player): string | null {
  const country = getPlayerCountry(player);
  return country && country !== UNKNOWN_COUNTRY ? country : null;
}

export function formatPlayerWeight(player: Player): string | null {
  const weight = player.weight?.trim();
  if (!weight) return null;

  return weight.includes("lbs") ? weight : `${weight} lbs`;
}

export function getPlayerSubtitle(player: Player, fallback = "Player"): string {
  const country = getPlayerCountry(player, fallback);
  return player.position ? `${player.position} • ${country}` : country;
}

/** Matches name, country and position. An empty query matches everything. */
export function matchesPlayerSearch(player: Player, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    getPlayerFullName(player),
    getPlayerCountry(player),
    player.position ?? "",
  ];

  return haystack.some((field) => field.toLowerCase().includes(needle));
}
