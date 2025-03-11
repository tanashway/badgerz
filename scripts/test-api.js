const fetch = require('node-fetch');

async function testApi() {
  try {
    console.log('Testing API routes...');
    
    // Test teams API
    console.log('\nTesting /api/teams...');
    const teamsResponse = await fetch('http://localhost:3000/api/teams');
    const teams = await teamsResponse.json();
    console.log(`Status: ${teamsResponse.status}`);
    console.log(`Found ${teams.length} teams`);
    
    // Test players API
    console.log('\nTesting /api/players...');
    const playersResponse = await fetch('http://localhost:3000/api/players');
    const players = await playersResponse.json();
    console.log(`Status: ${playersResponse.status}`);
    console.log(`Found ${players.length} players`);
    
    // Test staff API
    console.log('\nTesting /api/staff...');
    const staffResponse = await fetch('http://localhost:3000/api/staff');
    const staff = await staffResponse.json();
    console.log(`Status: ${staffResponse.status}`);
    console.log(`Found ${staff.length} staff members`);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 