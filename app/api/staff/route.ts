import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET all staff
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const teamId = url.searchParams.get('teamId');
    const role = url.searchParams.get('role');
    
    let query = supabase.from('staff').select('*');
    
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    
    if (role) {
      query = query.eq('role', role);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST a new staff member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, team_id, ...staffData } = body;
    
    // Validate required fields
    if (!name || !role || !team_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { data: staff, error } = await supabase
      .from('staff')
      .insert({
        id: uuidv4(),
        name,
        role,
        team_id,
        ...staffData
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
} 