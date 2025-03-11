const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://supabase.lucidsro.com';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoiYW5vbiJ9.N827pCpOn1nvdAhUC7OV_N4OBhPFB74jCYKtREZHZlE';
const supabaseServiceKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0MTY0ODMyMCwiZXhwIjo0ODk3MzIxOTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.oVjVZ09ZrpHHhZsXyByMy7vonBsKqXQNlF7Ie3Gvnds';

// Create Supabase clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test with anon key
    console.log('\nTesting with anon key...');
    const { data: teamsAnon, error: teamsAnonError } = await supabaseAnon
      .from('teams')
      .select('*');
    
    if (teamsAnonError) {
      console.error('Error fetching teams with anon key:', teamsAnonError);
    } else {
      console.log(`Found ${teamsAnon.length} teams with anon key`);
    }
    
    // Test with service role key
    console.log('\nTesting with service role key...');
    const { data: teamsService, error: teamsServiceError } = await supabaseService
      .from('teams')
      .select('*');
    
    if (teamsServiceError) {
      console.error('Error fetching teams with service role key:', teamsServiceError);
    } else {
      console.log(`Found ${teamsService.length} teams with service role key`);
    }
    
    // Test players with anon key
    console.log('\nTesting players with anon key...');
    const { data: playersAnon, error: playersAnonError } = await supabaseAnon
      .from('players')
      .select('*');
    
    if (playersAnonError) {
      console.error('Error fetching players with anon key:', playersAnonError);
    } else {
      console.log(`Found ${playersAnon.length} players with anon key`);
    }
    
    // Test players with service role key
    console.log('\nTesting players with service role key...');
    const { data: playersService, error: playersServiceError } = await supabaseService
      .from('players')
      .select('*');
    
    if (playersServiceError) {
      console.error('Error fetching players with service role key:', playersServiceError);
    } else {
      console.log(`Found ${playersService.length} players with service role key`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSupabase(); 