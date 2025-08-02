import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      signs: {
        Row: {
          id: string;
          photo: string;
          sign_details: string;
          sign_type: string;
          mutcd_name: string;
          mutcd_code: string;
          legend_color: string;
          background_color: string;
          sign_shape: string;
          upload_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          photo: string;
          sign_details: string;
          sign_type: string;
          mutcd_name: string;
          mutcd_code: string;
          legend_color: string;
          background_color: string;
          sign_shape: string;
          upload_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          photo?: string;
          sign_details?: string;
          sign_type?: string;
          mutcd_name?: string;
          mutcd_code?: string;
          legend_color?: string;
          background_color?: string;
          sign_shape?: string;
          upload_date?: string;
          created_at?: string;
        };
      };
    };
  };
};