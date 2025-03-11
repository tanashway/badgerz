import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET all players
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const teamId = url.searchParams.get('teamId');
    const position = url.searchParams.get('position');
    
    let query = supabase.from('players').select(`
      *,
      player_stats(*),
      player_contacts(*)
    `);
    
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    
    if (position) {
      query = query.eq('position', position);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

// POST a new player
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, number, position, team_id, stats, contact, ...playerData } = body;
    
    // Start a transaction
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert({
        id: uuidv4(),
        name,
        number,
        position,
        team_id,
        ...playerData
      })
      .select()
      .single();
    
    if (playerError) {
      return NextResponse.json(handleSupabaseError(playerError), { status: 400 });
    }
    
    // Add player stats if provided
    if (stats) {
      const { error: statsError } = await supabase
        .from('player_stats')
        .insert({
          player_id: player.id,
          season: stats.season || new Date().getFullYear().toString(),
          games: stats.games || 0,
          goals: stats.goals || 0,
          assists: stats.assists || 0,
          minutes: stats.minutes || 0,
          yellow_cards: stats.yellow_cards || 0,
          red_cards: stats.red_cards || 0,
          clean_sheets: stats.clean_sheets || null
        });
      
      if (statsError) {
        return NextResponse.json(handleSupabaseError(statsError), { status: 400 });
      }
    }
    
    // Add player contact if provided
    if (contact) {
      const { error: contactError } = await supabase
        .from('player_contacts')
        .insert({
          player_id: player.id,
          email: contact.email || null,
          phone: contact.phone || null,
          emergency_contact_name: contact.emergency_contact_name || null,
          emergency_contact_phone: contact.emergency_contact_phone || null,
          emergency_contact_relationship: contact.emergency_contact_relationship || null
        });
      
      if (contactError) {
        return NextResponse.json(handleSupabaseError(contactError), { status: 400 });
      }
    }
    
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
} 