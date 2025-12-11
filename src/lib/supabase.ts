import { createClient } from '@supabase/supabase-js';
import { Event } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event & {
          created_at: string;
          created_by: string | null;
          updated_at: string;
        };
        Insert: Omit<Event, 'id'> & {
          created_by?: string;
        };
        Update: Partial<Omit<Event, 'id'>>;
      };
    };
  };
}
