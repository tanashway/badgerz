import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET all teams
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const season = url.searchParams.get('season');
    const ageGroup = url.searchParams.get('ageGroup');
    
    let query = supabase.from('teams').select('*');
    
    if (season) {
      query = query.eq('season', season);
    }
    
    if (ageGroup) {
      query = query.eq('age_group', ageGroup);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST a new team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age_group, season, ...teamData } = body;
    
    // Validate required fields
    if (!name || !age_group || !season) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { data: team, error } = await supabase
      .from('teams')
      .insert({
        id: uuidv4(),
        name,
        age_group,
        season,
        ...teamData
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}

// GET team by ID with related data
export async function GET_TEAM_WITH_RELATED(teamId: string) {
  try {
    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    
    if (teamError) {
      throw teamError;
    }
    
    // Get players for the team
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select(`
        *,
        player_stats(*)
      `)
      .eq('team_id', teamId);
    
    if (playersError) {
      throw playersError;
    }
    
    // Get staff for the team
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('team_id', teamId);
    
    if (staffError) {
      throw staffError;
    }
    
    // Get games for the team
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .eq('team_id', teamId)
      .order('date');
    
    if (gamesError) {
      throw gamesError;
    }
    
    // Get announcements for the team
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });
    
    if (announcementsError) {
      throw announcementsError;
    }
    
    // Combine all data
    return {
      ...team,
      players,
      staff,
      games,
      announcements
    };
  } catch (error) {
    console.error('Error fetching team with related data:', error);
    throw error;
  }
} 