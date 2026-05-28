/**
 * Database Types
 * 
 * Generated from Supabase schema
 * Run: supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts
 * 
 * For now, this includes basic types for the language learning app
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
    CompositeTypes: Record<string, unknown>;
  };
}

// Helper types for common operations
export type TableNames = keyof Database['public']['Tables'];

export interface SupabaseError {
  message: string;
  status?: number;
  code?: string;
}
