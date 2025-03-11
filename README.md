# Badgers 2014 Soccer Team Management

A comprehensive platform for managing youth soccer teams, featuring player management, scheduling, game-day statistics, team communication, and AI assistance.

## Database Setup with Supabase

This project uses Supabase PostgreSQL for data storage. Follow these steps to set up your database:

### 1. Set Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com) or use your self-hosted instance.
2. Create a new project in Supabase.
3. Copy your Supabase URL and anon key from the project settings.
4. Update the `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard.
2. Copy the contents of `db/schema.sql` from this project.
3. Paste and run the SQL in the Supabase SQL Editor.

This will create the following tables:
- `teams`: Store team information
- `players`: Store player information
- `player_stats`: Store player statistics
- `player_contacts`: Store player contact information
- `staff`: Store coaching staff information
- `games`: Store game information
- `game_attendance`: Track player attendance for games
- `game_stats`: Store player statistics for specific games
- `announcements`: Store team announcements

### 3. Generate TypeScript Types (Optional)

To generate TypeScript types for your database schema:

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Generate types:
```bash
npm run update-types
```

Note: Update the project ID in the `update-types` script in `package.json` with your Supabase project ID.

## API Endpoints

The application provides the following API endpoints:

### Teams

- `GET /api/teams`: Get all teams
- `POST /api/teams`: Create a new team
- `GET /api/teams/:id`: Get a specific team
- `PATCH /api/teams/:id`: Update a team
- `DELETE /api/teams/:id`: Delete a team

### Players

- `GET /api/players`: Get all players
- `POST /api/players`: Create a new player

### Games

- `GET /api/games`: Get all games
- `POST /api/games`: Create a new game
- `PATCH /api/games`: Update game results

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Features

- **Team Management**: Create and manage multiple teams
- **Player Management**: Track player information, statistics, and development
- **Game Scheduling**: Manage game schedules and locations
- **Game-Day Statistics**: Record and analyze game statistics
- **Team Communication**: Share announcements and updates with the team
- **AI Assistance**: Get help with team management tasks

## License

MIT 