const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://supabase.lucidsro.com';
const supabaseServiceKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.oVjVZ09ZrpHHhZsXyByMy7vonBsKqXQNlF7Ie3Gvnds';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Team data
const team = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Badgers 2014',
  age_group: 'U11',
  league: 'Regional Youth Soccer League',
  season: 'Spring 2025',
  primary_color: '#FF0000',
  secondary_color: '#FFFFFF'
};

// Player data
const players = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Alex Johnson',
    number: 10,
    position: 'Forward',
    height: '4\'8"',
    weight: '85 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Sam Williams',
    number: 8,
    position: 'Midfielder',
    height: '4\'7"',
    weight: '82 lbs',
    foot: 'Left',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'Taylor Brown',
    number: 1,
    position: 'Goalkeeper',
    height: '4\'9"',
    weight: '90 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    name: 'Jordan Smith',
    number: 5,
    position: 'Defender',
    height: '4\'6"',
    weight: '80 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    name: 'Casey Martinez',
    number: 9,
    position: 'Forward',
    height: '4\'7"',
    weight: '83 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    name: 'Morgan Clark',
    number: 6,
    position: 'Midfielder',
    height: '4\'8"',
    weight: '84 lbs',
    foot: 'Left',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222207',
    name: 'Avery Wilson',
    number: 4,
    position: 'Defender',
    height: '4\'9"',
    weight: '86 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222208',
    name: 'Drew Parker',
    number: 7,
    position: 'Midfielder',
    height: '4\'7"',
    weight: '81 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222209',
    name: 'Jamie Lee',
    number: 3,
    position: 'Defender',
    height: '4\'8"',
    weight: '85 lbs',
    foot: 'Left',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '22222222-2222-2222-2222-222222222210',
    name: 'Pat Quinn',
    number: 2,
    position: 'Defender',
    height: '4\'6"',
    weight: '79 lbs',
    foot: 'Right',
    age: 11,
    team_id: '11111111-1111-1111-1111-111111111111'
  }
];

// Player stats data
const playerStats = [
  {
    player_id: '22222222-2222-2222-2222-222222222201',
    season: 'Spring 2025',
    games: 11,
    goals: 8,
    assists: 5,
    minutes: 880,
    yellow_cards: 1,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222202',
    season: 'Spring 2025',
    games: 11,
    goals: 3,
    assists: 7,
    minutes: 990,
    yellow_cards: 0,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222203',
    season: 'Spring 2025',
    games: 11,
    goals: 0,
    assists: 0,
    minutes: 990,
    yellow_cards: 0,
    red_cards: 0,
    clean_sheets: 5
  },
  {
    player_id: '22222222-2222-2222-2222-222222222204',
    season: 'Spring 2025',
    games: 11,
    goals: 1,
    assists: 2,
    minutes: 990,
    yellow_cards: 2,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222205',
    season: 'Spring 2025',
    games: 11,
    goals: 6,
    assists: 2,
    minutes: 880,
    yellow_cards: 0,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222206',
    season: 'Spring 2025',
    games: 10,
    goals: 2,
    assists: 4,
    minutes: 800,
    yellow_cards: 1,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222207',
    season: 'Spring 2025',
    games: 11,
    goals: 0,
    assists: 1,
    minutes: 990,
    yellow_cards: 1,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222208',
    season: 'Spring 2025',
    games: 9,
    goals: 2,
    assists: 3,
    minutes: 720,
    yellow_cards: 0,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222209',
    season: 'Spring 2025',
    games: 11,
    goals: 0,
    assists: 0,
    minutes: 990,
    yellow_cards: 1,
    red_cards: 0,
    clean_sheets: null
  },
  {
    player_id: '22222222-2222-2222-2222-222222222210',
    season: 'Spring 2025',
    games: 10,
    goals: 0,
    assists: 1,
    minutes: 900,
    yellow_cards: 0,
    red_cards: 0,
    clean_sheets: null
  }
];

// Staff data
const staff = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    name: 'Michael Thompson',
    role: 'Head Coach',
    email: 'michael.thompson@example.com',
    phone: '555-111-2222',
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    name: 'Sarah Rodriguez',
    role: 'Assistant Coach',
    email: 'sarah.rodriguez@example.com',
    phone: '555-222-3333',
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    name: 'David Wilson',
    role: 'Team Manager',
    email: 'david.wilson@example.com',
    phone: '555-333-4444',
    team_id: '11111111-1111-1111-1111-111111111111'
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    name: 'Jennifer Adams',
    role: 'Athletic Trainer',
    email: 'jennifer.adams@example.com',
    phone: '555-444-5555',
    team_id: '11111111-1111-1111-1111-111111111111'
  }
];

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Insert team
    console.log('Inserting team...');
    const { error: teamError } = await supabase
      .from('teams')
      .upsert(team, { onConflict: 'id' });

    if (teamError) {
      console.error('Error inserting team:', teamError);
      return;
    }

    // Insert players
    console.log('Inserting players...');
    const { error: playersError } = await supabase
      .from('players')
      .upsert(players, { onConflict: 'id' });

    if (playersError) {
      console.error('Error inserting players:', playersError);
      return;
    }

    // Insert player stats
    console.log('Inserting player stats...');
    const { error: statsError } = await supabase
      .from('player_stats')
      .upsert(playerStats, { onConflict: ['player_id', 'season'] });

    if (statsError) {
      console.error('Error inserting player stats:', statsError);
      return;
    }

    // Insert staff
    console.log('Inserting staff...');
    const { error: staffError } = await supabase
      .from('staff')
      .upsert(staff, { onConflict: 'id' });

    if (staffError) {
      console.error('Error inserting staff:', staffError);
      return;
    }

    console.log('Data seeding completed successfully!');

    // Verify data was inserted
    const { data: playersData, error: playersQueryError } = await supabase
      .from('players')
      .select('*');

    if (playersQueryError) {
      console.error('Error fetching players:', playersQueryError);
      return;
    }

    console.log(`Found ${playersData.length} players in the database:`);
    playersData.forEach(player => {
      console.log(`- ${player.name} (#${player.number}, ${player.position})`);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

seedData(); 