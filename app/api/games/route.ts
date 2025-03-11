import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET all games
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const teamId = url.searchParams.get('teamId');
    const season = url.searchParams.get('season');
    const type = url.searchParams.get('type');
    const upcoming = url.searchParams.get('upcoming');
    
    let query = supabase.from('games').select('*');
    
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    
    if (season) {
      query = query.eq('season', season);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    // For upcoming games, we need to filter by date
    // This is a simplified approach - in a real app, you'd use proper date handling
    if (upcoming === 'true') {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      query = query.gte('date', formattedDate);
    }
    
    const { data, error } = await query.order('date');
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST a new game
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      team_id, 
      opponent, 
      date, 
      time, 
      location, 
      home_away, 
      type, 
      season,
      ...gameData 
    } = body;
    
    // Validate required fields
    if (!team_id || !opponent || !date || !time || !location || !home_away || !type || !season) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        id: uuidv4(),
        team_id,
        opponent,
        date,
        time,
        location,
        home_away,
        type,
        season,
        ...gameData
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

// PATCH to update game results
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, result, score_team, score_opponent, ...gameData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    const { data: game, error } = await supabase
      .from('games')
      .update({
        result,
        score_team,
        score_opponent,
        ...gameData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
} 