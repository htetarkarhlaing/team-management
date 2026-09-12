# Premier League (EPL) Team Manager

A React application for browsing Premier League players, constructing custom squads, and managing team rosters.

## Features

- **Player Directory**: Browse live Premier League players from the BallDontLie EPL API with cursor pagination (infinite scroll), name/country/position search, country filtering, and A–Z sorting.
- **Custom Squads**: Create, edit, and delete teams with region, country, and maximum roster capacity. Team names are unique, case-insensitively.
- **Roster Management**: Assign and remove players. A player belongs to at most one team, and a team never exceeds its capacity.
- **Session Authentication**: Client-side accounts (bcrypt-hashed passwords) with the session and teams persisted across browser sessions.

## Tech Stack

- **Framework**: React 19, Vite, TypeScript
- **State Management**: Redux Toolkit, React Redux
- **Forms & Validation**: React Hook Form, Zod
- **Styling**: Tailwind CSS
- **Icons**: Hugeicons

## Getting Started

### 1. Environment Setup

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure your BallDontLie API key in `.env.local`:

```env
VITE_BALLDONTLIE_API_KEY=your_api_key_here
```

### 2. Install & Run

```bash
npm install
npm run dev
```

### 3. Verify

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # oxlint
npm run build       # typecheck + production bundle
```

## Project Structure

```
src/
├── app/                  Application shell
│   ├── App.tsx           Route table
│   ├── provider.tsx      Error boundary + Redux provider
│   ├── layout/           AppHeader, ProtectedLayout (auth gate)
│   └── routes/           One component per page, plus paths.ts
├── components/
│   ├── auth/             Login and registration forms
│   ├── players/          Player directory: cards, list, toolbar, assign modal
│   ├── teams/            Team cards, list, and the create/edit/delete/manage dialogs
│   ├── common/           Error boundary
│   └── ui/               Presentational primitives shared across features
├── hooks/                Reusable behaviour (infinite scroll, player filters, data loading)
├── lib/
│   ├── api/              HTTP clients; untrusted responses are narrowed here
│   ├── auth/             Local account directory
│   ├── crypto/           Password hashing
│   ├── players/          Player display helpers and search matching
│   ├── teams/            Team business rules (capacity, unique names)
│   ├── storage/          Non-throwing localStorage wrapper
│   ├── constants.ts      Values shared by more than one module
│   └── utils.ts          `cn` class-name helper
├── store/
│   ├── slices/           auth, teams, players (Redux Toolkit)
│   ├── selectors/        Split per slice, re-exported from `@/store/selectors`
│   └── persistence/      Session and teams persisted to localStorage
└── types/                Shared domain types
```

### Conventions

- **Import through the alias**: `@/` maps to `src/`. Import selectors from `@/store/selectors`, never from an individual selector file.
- **Business rules live in `lib/`**, not in components. `lib/teams/team.ts` holds the capacity and uniqueness rules that both the reducers and the UI check, so a disabled button and the reducer can never disagree.
- **Derived player values come from `lib/players/player.ts`**. The API returns partially populated records; `getPlayerFullName`, `getPlayerCountry` and friends own every fallback chain.
- **Components stay presentational where possible.** Stateful list logic belongs in a hook (see `hooks/usePlayerFilters.ts`); dialogs receive their subject as a prop and treat `null` as "closed".
- **State is reset with a `key` or derived during render**, not in an effect.

### Data Flow

1. `ProtectedLayout` loads the first page of players once per session — both the directory and the squad dialogs read the same list.
2. `PlayerList` appends further pages via `useInfiniteScroll` and filters the loaded set client-side.
3. Team edits dispatch to `teamsSlice`; a store subscription mirrors `auth` and `teams` into localStorage.
4. On startup the store rehydrates from localStorage and flips `auth.isHydrated`, which the routes wait on before redirecting.
