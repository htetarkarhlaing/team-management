import type {
  Player,
  PlayersApiResponse,
  PlayersPaginationMeta,
} from "@/types/player";
import { UNKNOWN_COUNTRY } from "@/lib/players/player";
import { PLAYERS_PAGE_SIZE } from "@/lib/constants";

const API_BASE_URL = "https://api.balldontlie.io/epl/v2";

const ERROR_BY_STATUS: Record<number, string> = {
  401: "Unauthorized: a valid API key is required in VITE_BALLDONTLIE_API_KEY.",
  429: "Rate limit exceeded: please wait a moment before trying again.",
};

export interface GetPlayersParams {
  /** Cursor returned by the previous page; omit to fetch the first page. */
  cursor?: number | null;
  perPage?: number;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parsePlayer(raw: Record<string, unknown>): Player {
  const firstName = optionalString(raw.first_name) ?? "";
  const lastName = optionalString(raw.last_name) ?? "";
  const citizenship = optionalString(raw.citizenship);

  return {
    id: Number(raw.id),
    first_name: firstName,
    last_name: lastName,
    display_name:
      optionalString(raw.display_name) ?? `${firstName} ${lastName}`.trim(),
    short_name: optionalString(raw.short_name),
    position: optionalString(raw.position),
    height: optionalString(raw.height) ?? null,
    weight: optionalString(raw.weight) ?? null,
    citizenship: citizenship ?? null,
    country: citizenship ?? optionalString(raw.country) ?? UNKNOWN_COUNTRY,
    age: typeof raw.age === "number" ? raw.age : null,
    date_of_birth: optionalString(raw.date_of_birth) ?? null,
  };
}

function parseMeta(raw: unknown, perPage: number): PlayersPaginationMeta {
  const meta = (raw ?? {}) as Partial<PlayersPaginationMeta>;

  return {
    per_page: typeof meta.per_page === "number" ? meta.per_page : perPage,
    next_cursor: typeof meta.next_cursor === "number" ? meta.next_cursor : null,
    prev_cursor:
      typeof meta.prev_cursor === "number" ? meta.prev_cursor : undefined,
  };
}

function buildPlayersUrl({
  cursor,
  perPage,
}: Required<GetPlayersParams>): string {
  const url = new URL(`${API_BASE_URL}/players`);
  url.searchParams.set("per_page", String(perPage));

  if (cursor !== null && cursor !== undefined) {
    url.searchParams.set("cursor", String(cursor));
  }

  return url.toString();
}

/** Throws with a message safe to show the user when the request fails. */
export async function getPlayers({
  cursor = null,
  perPage = PLAYERS_PAGE_SIZE,
}: GetPlayersParams = {}): Promise<PlayersApiResponse> {
  const apiKey = import.meta.env.VITE_BALLDONTLIE_API_KEY;

  const headers: HeadersInit = { Accept: "application/json" };
  if (apiKey) {
    headers.Authorization = apiKey;
  }

  const response = await fetch(buildPlayersUrl({ cursor, perPage }), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      ERROR_BY_STATUS[response.status] ??
        `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  const body = (await response.json()) as { data?: unknown; meta?: unknown };
  const rawPlayers = Array.isArray(body.data) ? body.data : [];

  return {
    data: rawPlayers.map((raw) => parsePlayer(raw as Record<string, unknown>)),
    meta: parseMeta(body.meta, perPage),
  };
}
