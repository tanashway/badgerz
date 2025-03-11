const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://supabase.lucidsro.com';
const supabaseServiceKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.oVjVZ09ZrpHHhZsXyByMy7vonBsKqXQNlF7Ie3Gvnds';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Check teams table
    console.log('\nChecking teams table...');
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*');
    
    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
    } else {
      console.log(`Found ${teams.length} teams:`);
      teams.forEach(team => {
        console.log(`- ${team.name} (${team.age_group})`);
      });
    }
    
    // Check players table
    console.log('\nChecking players table...');
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*');
    
    if (playersError) {
      console.error('Error fetching players:', playersError);
    } else {
      console.log(`Found ${players.length} players:`);
      players.forEach(player => {
        console.log(`- ${player.name} (#${player.number}, ${player.position})`);
      });
    }
    
    // Check player_stats table
    console.log('\nChecking player_stats table...');
    const { data: playerStats, error: playerStatsError } = await supabase
      .from('player_stats')
      .select('*');
    
    if (playerStatsError) {
      console.error('Error fetching player stats:', playerStatsError);
    } else {
      console.log(`Found ${playerStats.length} player stats entries`);
    }
    
    // Check staff table
    console.log('\nChecking staff table...');
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*');
    
    if (staffError) {
      console.error('Error fetching staff:', staffError);
    } else {
      console.log(`Found ${staff.length} staff members:`);
      staff.forEach(person => {
        console.log(`- ${person.name} (${person.role})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkDatabase(); 