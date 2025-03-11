-- Insert the Badgers team
INSERT INTO teams (id, name, age_group, league, season, primary_color, secondary_color)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Badgers 2014', 'U11', 'Regional Youth Soccer League', 'Spring 2025', '#FF0000', '#FFFFFF')
ON CONFLICT (id) DO NOTHING;

-- Insert players
INSERT INTO players (id, name, number, position, height, weight, foot, age, team_id)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Alex Johnson', 10, 'Forward', '4''8"', '85 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222202', 'Sam Williams', 8, 'Midfielder', '4''7"', '82 lbs', 'Left', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222203', 'Taylor Brown', 1, 'Goalkeeper', '4''9"', '90 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222204', 'Jordan Smith', 5, 'Defender', '4''6"', '80 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222205', 'Casey Martinez', 9, 'Forward', '4''7"', '83 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222206', 'Morgan Clark', 6, 'Midfielder', '4''8"', '84 lbs', 'Left', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222207', 'Avery Wilson', 4, 'Defender', '4''9"', '86 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222208', 'Drew Parker', 7, 'Midfielder', '4''7"', '81 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222209', 'Jamie Lee', 3, 'Defender', '4''8"', '85 lbs', 'Left', 11, '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222210', 'Pat Quinn', 2, 'Defender', '4''6"', '79 lbs', 'Right', 11, '11111111-1111-1111-1111-111111111111')
ON CONFLICT (team_id, number) DO NOTHING;

-- Insert player stats
INSERT INTO player_stats (player_id, season, games, goals, assists, minutes, yellow_cards, red_cards, clean_sheets)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Spring 2025', 11, 8, 5, 880, 1, 0, NULL),
  ('22222222-2222-2222-2222-222222222202', 'Spring 2025', 11, 3, 7, 990, 0, 0, NULL),
  ('22222222-2222-2222-2222-222222222203', 'Spring 2025', 11, 0, 0, 990, 0, 0, 5),
  ('22222222-2222-2222-2222-222222222204', 'Spring 2025', 11, 1, 2, 990, 2, 0, NULL),
  ('22222222-2222-2222-2222-222222222205', 'Spring 2025', 11, 6, 2, 880, 0, 0, NULL),
  ('22222222-2222-2222-2222-222222222206', 'Spring 2025', 10, 2, 4, 800, 1, 0, NULL),
  ('22222222-2222-2222-2222-222222222207', 'Spring 2025', 11, 0, 1, 990, 1, 0, NULL),
  ('22222222-2222-2222-2222-222222222208', 'Spring 2025', 9, 2, 3, 720, 0, 0, NULL),
  ('22222222-2222-2222-2222-222222222209', 'Spring 2025', 11, 0, 0, 990, 1, 0, NULL),
  ('22222222-2222-2222-2222-222222222210', 'Spring 2025', 10, 0, 1, 900, 0, 0, NULL)
ON CONFLICT (player_id, season) DO NOTHING;

-- Insert player contacts
INSERT INTO player_contacts (player_id, email, phone, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'alex.parent@example.com', '555-123-4567', 'Alex Parent', '555-123-4568', 'Parent'),
  ('22222222-2222-2222-2222-222222222202', 'sam.parent@example.com', '555-234-5678', 'Sam Parent', '555-234-5679', 'Parent'),
  ('22222222-2222-2222-2222-222222222203', 'taylor.parent@example.com', '555-345-6789', 'Taylor Parent', '555-345-6780', 'Parent'),
  ('22222222-2222-2222-2222-222222222204', 'jordan.parent@example.com', '555-456-7890', 'Jordan Parent', '555-456-7891', 'Parent'),
  ('22222222-2222-2222-2222-222222222205', 'casey.parent@example.com', '555-567-8901', 'Casey Parent', '555-567-8902', 'Parent'),
  ('22222222-2222-2222-2222-222222222206', 'morgan.parent@example.com', '555-678-9012', 'Morgan Parent', '555-678-9013', 'Parent'),
  ('22222222-2222-2222-2222-222222222207', 'avery.parent@example.com', '555-789-0123', 'Avery Parent', '555-789-0124', 'Parent'),
  ('22222222-2222-2222-2222-222222222208', 'drew.parent@example.com', '555-890-1234', 'Drew Parent', '555-890-1235', 'Parent'),
  ('22222222-2222-2222-2222-222222222209', 'jamie.parent@example.com', '555-901-2345', 'Jamie Parent', '555-901-2346', 'Parent'),
  ('22222222-2222-2222-2222-222222222210', 'pat.parent@example.com', '555-012-3456', 'Pat Parent', '555-012-3457', 'Parent')
ON CONFLICT (player_id) DO NOTHING;

-- Insert staff
INSERT INTO staff (id, name, role, email, phone, team_id)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Michael Thompson', 'Head Coach', 'michael.thompson@example.com', '555-111-2222', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333302', 'Sarah Rodriguez', 'Assistant Coach', 'sarah.rodriguez@example.com', '555-222-3333', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333303', 'David Wilson', 'Team Manager', 'david.wilson@example.com', '555-333-4444', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333304', 'Jennifer Adams', 'Athletic Trainer', 'jennifer.adams@example.com', '555-444-5555', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Insert upcoming games
INSERT INTO games (id, team_id, opponent, date, time, location, home_away, type, season)
VALUES
  ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', 'Wildcats FC', '2025-06-15', '10:00 AM', 'Memorial Park, Field 3', 'Home', 'League', 'Spring 2025'),
  ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', 'Eagles United', '2025-06-23', '1:30 PM', 'Riverside Complex, Field A', 'Away', 'League', 'Spring 2025'),
  ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111111', 'Strikers SC', '2025-06-29', '11:00 AM', 'Eastside Sports Complex, Field 2', 'Away', 'League', 'Spring 2025')
ON CONFLICT (id) DO NOTHING;

-- Insert recent game results
INSERT INTO games (id, team_id, opponent, date, time, location, home_away, type, season, result, score_team, score_opponent)
VALUES
  ('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111111', 'Westside Strikers', '2025-05-25', '10:00 AM', 'Memorial Park, Field 3', 'Home', 'League', 'Spring 2025', 'Win', 3, 0),
  ('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111111', 'Metro FC', '2025-05-18', '1:30 PM', 'Metro Complex, Field 2', 'Away', 'League', 'Spring 2025', 'Draw', 1, 1),
  ('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111111', 'Riverside United', '2025-05-11', '11:00 AM', 'Memorial Park, Field 3', 'Home', 'League', 'Spring 2025', 'Win', 2, 1),
  ('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111111', 'Southside FC', '2025-04-27', '10:00 AM', 'Southside Complex, Field 1', 'Away', 'League', 'Spring 2025', 'Loss', 0, 2),
  ('44444444-4444-4444-4444-444444444408', '11111111-1111-1111-1111-111111111111', 'North United', '2025-04-20', '1:30 PM', 'Memorial Park, Field 3', 'Home', 'League', 'Spring 2025', 'Win', 4, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert announcements
INSERT INTO announcements (id, title, content, category, author, team_id, is_pinned)
VALUES
  ('55555555-5555-5555-5555-555555555501', 'Summer Tournament Registration', 'Please register for the summer tournament by June 1st. The tournament will be held on July 12-14, 2025.', 'Tournament', 'David Wilson', '11111111-1111-1111-1111-111111111111', true),
  ('55555555-5555-5555-5555-555555555502', 'Team Fundraiser', 'Car wash fundraiser on Saturday, May 25, 2025, 9AM-2PM at the community center. All players are expected to participate.', 'Fundraiser', 'David Wilson', '11111111-1111-1111-1111-111111111111', true),
  ('55555555-5555-5555-5555-555555555503', 'Practice Schedule Change', 'Due to field maintenance, practice on Thursday will be moved to Field 4 instead of Field 2.', 'Practice', 'Michael Thompson', '11111111-1111-1111-1111-111111111111', false)
ON CONFLICT (id) DO NOTHING; 