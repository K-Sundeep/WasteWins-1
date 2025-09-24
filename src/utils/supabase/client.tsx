import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      kv_store_84fed428: {
        Row: {
          key: string;
          value: any;
          created_at: string;
        };
        Insert: {
          key: string;
          value: any;
          created_at?: string;
        };
        Update: {
          key?: string;
          value?: any;
          created_at?: string;
        };
      };
    };
  };
};