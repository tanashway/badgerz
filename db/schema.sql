-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'Hkp17AAVb8AYJTW3its2OiSXMzcANTL5';

-- Create tables with proper timestamps and UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  league TEXT,
  season TEXT NOT NULL,
  logo TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  description TEXT
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  position TEXT NOT NULL,
  height TEXT,
  weight TEXT,
  foot TEXT,
  age INTEGER,
  avatar TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  UNIQUE(team_id, number)
);

-- Player stats table
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  games INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  clean_sheets INTEGER,
  UNIQUE(player_id, season)
);

-- Player contacts table
CREATE TABLE IF NOT EXISTS player_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  UNIQUE(player_id)
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  avatar TEXT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  home_away TEXT NOT NULL,
  type TEXT NOT NULL,
  season TEXT NOT NULL,
  result TEXT,
  score_team INTEGER,
  score_opponent INTEGER,
  notes TEXT
);

-- Game attendance table
CREATE TABLE IF NOT EXISTS game_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  UNIQUE(game_id, player_id)
);

-- Game stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  minutes_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  notes TEXT,
  UNIQUE(game_id, player_id)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON players
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_player_stats_updated_at
BEFORE UPDATE ON player_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_player_contacts_updated_at
BEFORE UPDATE ON player_contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_game_attendance_updated_at
BEFORE UPDATE ON game_attendance
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_game_stats_updated_at
BEFORE UPDATE ON game_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- For now, we'll allow all authenticated users to read all data
-- In a real app, you'd want more granular policies based on team membership

-- Teams policies
CREATE POLICY "Allow authenticated users to read teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (true);

-- Players policies
CREATE POLICY "Allow authenticated users to read players"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update players"
  ON players FOR UPDATE
  TO authenticated
  USING (true);

-- Similar policies for other tables
-- (Abbreviated for brevity - in production you would add policies for all tables)

-- Create sample data for testing
INSERT INTO teams (name, age_group, league, season)
VALUES ('Badgers 2014', 'U11', 'Regional Youth Soccer League', 'Spring 2025');

-- Get the team ID for use in other inserts
DO $$
DECLARE
  team_id UUID;
BEGIN
  SELECT id INTO team_id FROM teams WHERE name = 'Badgers 2014' LIMIT 1;

  -- Insert sample staff
  INSERT INTO staff (name, role, team_id)
  VALUES 
    ('Michael Thompson', 'Head Coach', team_id),
    ('Sarah Rodriguez', 'Assistant Coach', team_id),
    ('David Wilson', 'Team Manager', team_id);

  -- Insert sample players
  INSERT INTO players (name, number, position, team_id)
  VALUES 
    ('Alex Johnson', 10, 'Forward', team_id),
    ('Sam Williams', 8, 'Midfielder', team_id),
    ('Casey Martinez', 9, 'Forward', team_id),
    ('Taylor Brown', 1, 'Goalkeeper', team_id),
    ('Jordan Smith', 5, 'Defender', team_id),
    ('Riley Garcia', 6, 'Midfielder', team_id);

  -- Insert sample games
  INSERT INTO games (team_id, opponent, date, time, location, home_away, type, season)
  VALUES 
    (team_id, 'Wildcats FC', 'Sat, Jun 15', '10:00 AM', 'Memorial Park, Field 3', 'Home', 'League Match', 'Spring 2025'),
    (team_id, 'Eagles United', 'Sun, Jun 23', '1:30 PM', 'Riverside Complex, Field A', 'Away', 'Tournament', 'Spring 2025');

  -- Insert sample announcements
  INSERT INTO announcements (title, content, category, author, team_id)
  VALUES 
    ('Summer Training Schedule Released', 'Our summer training schedule is now available. We''ll be focusing on conditioning and technical skills. Please make sure to bring plenty of water as temperatures will be high.', 'Training', 'Coach Thompson', team_id),
    ('Team Fundraiser Next Weekend', 'We''re hosting a car wash fundraiser next Saturday from 9AM-2PM at the community center. All players are expected to participate for at least one hour. Parents, please sign up to bring supplies.', 'Event', 'Team Manager', team_id);
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY,  -- This will match the Supabase auth.users.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',  -- 'user', 'admin', 'coach', etc.
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- For teams
CREATE POLICY "Teams are viewable by everyone" 
ON teams FOR SELECT USING (true);

CREATE POLICY "Teams can be created by authenticated users" 
ON teams FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teams can be updated by team admins" 
ON teams FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.team_id = teams.id 
        AND user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'coach')
    )
);

-- For user_profiles
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON user_profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- For players
CREATE POLICY "Players are viewable by everyone" 
ON players FOR SELECT USING (true);

CREATE POLICY "Players can be created by team admins" 
ON players FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.team_id = players.team_id 
        AND user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'coach')
    )
);

CREATE POLICY "Players can be updated by team admins" 
ON players FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.team_id = players.team_id 
        AND user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'coach')
    )
);

-- Similar policies for other tables...

-- Create indexes for performance
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_games_team_id ON games(team_id);
CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX idx_game_stats_game_id ON game_stats(game_id);
CREATE INDEX idx_game_stats_player_id ON game_stats(player_id);
CREATE INDEX idx_user_profiles_team_id ON user_profiles(team_id); 