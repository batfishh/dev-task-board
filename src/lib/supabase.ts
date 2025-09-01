import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DEV_BOARDSUPABASE_URL!;
const supabaseAnonKey = process.env.DEV_BOARDSUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export interface BoardData {
  postIts: Array<{
    id: string;
    x: number;
    y: number;
    text: string;
    type: 'todo' | 'progress' | 'done' | 'bug' | 'feature';
  }>;
  drawingLines: Array<{
    points: number[];
    id: string;
  }>;
}

export interface BoardRecord {
  id: string;
  name: string;
  board_data: BoardData;
  created_at: string;
  updated_at: string;
}