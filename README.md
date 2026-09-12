# Premier League (EPL) Team Manager

A React application for browsing Premier League players, constructing custom squads, and managing team rosters.

## Features

- **Player Directory**: Browse live Premier League players from the BallDontLie EPL API with cursor pagination, name/country filters, and player profile cards.
- **Custom Squads**: Create, edit, and delete custom teams with region, country, and maximum roster capacity constraints.
- **Roster Management**: Assign and remove players across teams with single-team assignment rules and capacity tracking.
- **Session Authentication**: Client-side authentication and roster state persisted across browser sessions.

## Tech Stack

- **Framework**: React 19, Vite, TypeScript
- **State Management**: Redux Toolkit, React Redux
- **Forms & Validation**: React Hook Form, Zod
- **Styling**: Tailwind CSS

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

### 3. Build & Lint

```bash
npm run build
npm run lint
```
