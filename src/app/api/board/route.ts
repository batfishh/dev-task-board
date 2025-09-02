import { NextRequest, NextResponse } from 'next/server';
import { supabase, type BoardData } from '@/lib/supabase';
import { validateRequest } from '@/lib/auth';

// GET - Load board state
export async function GET(request: NextRequest) {
  // Validate JWT token
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('board_data, updated_at')
      .eq('name', 'main')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error loading board:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to load board' },
        { status: 500 }
      );
    }

    if (!data) {
      // Return empty state if no board exists
      return NextResponse.json({
        postIts: [],
        drawingLines: [],
        lastUpdated: null
      });
    }

    return NextResponse.json({
      ...data.board_data,
      lastUpdated: data.updated_at
    });

  } catch (error) {
    console.error('Error loading board:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load board' },
      { status: 500 }
    );
  }
}

// POST - Save board state
export async function POST(request: NextRequest) {
  // Validate JWT token
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const boardData: BoardData = await request.json();

    // Validate the data structure
    if (!boardData.postIts || !Array.isArray(boardData.postIts)) {
      return NextResponse.json(
        { success: false, error: 'Invalid board data structure' },
        { status: 400 }
      );
    }

    // Delete existing board with name 'main' (ignores error if no row exists)
    await supabase
      .from('boards')
      .delete()
      .eq('name', 'main');

    // Insert new board data
    const { data, error } = await supabase
      .from('boards')
      .insert({
        name: 'main',
        board_data: boardData,
      })
      .select('updated_at')
      .single();

    if (error) {
      console.error('Error saving board:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save board' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Board saved successfully (replaced)',
      timestamp: data.updated_at
    });

  } catch (error) {
    console.error('Error saving board:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save board' },
      { status: 500 }
    );
  }
}