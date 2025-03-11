import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { GET_TEAM_WITH_RELATED } from '../route';

// GET team by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const includeRelated = req.nextUrl.searchParams.get('includeRelated') === 'true';
    
    if (includeRelated) {
      try {
        const teamWithRelated = await GET_TEAM_WITH_RELATED(id);
        return NextResponse.json(teamWithRelated);
      } catch (error) {
        return NextResponse.json(handleSupabaseError(error), { status: 400 });
      }
    } else {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return NextResponse.json(handleSupabaseError(error), { status: 400 });
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

// PATCH to update team
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('teams')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}

// DELETE team
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
} 