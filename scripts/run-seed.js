const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://supabase.lucidsro.com';
const supabaseServiceKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.oVjVZ09ZrpHHhZsXyByMy7vonBsKqXQNlF7Ie3Gvnds';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSeed() {
  try {
    // Read the seed SQL file
    const seedSQL = fs.readFileSync('./db/seed.sql', 'utf8');
    
    console.log('Running seed SQL...');
    
    // Execute the SQL using Supabase's rpc function
    const { data, error } = await supabase.rpc('exec_sql', { sql: seedSQL });
    
    if (error) {
      console.error('Error running seed SQL:', error);
      return;
    }
    
    console.log('Seed SQL executed successfully!');
    console.log('Result:', data);
    
    // Verify data was inserted
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*');
    
    if (playersError) {
      console.error('Error fetching players:', playersError);
      return;
    }
    
    console.log(`Found ${players.length} players in the database:`);
    players.forEach(player => {
      console.log(`- ${player.name} (#${player.number}, ${player.position})`);
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runSeed(); 