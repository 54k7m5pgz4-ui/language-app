/**
 * Supabase Configuration
 * 
 * Environment variables required:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

/**
 * Validate that required environment variables are set
 */
export function validateSupabaseConfig(): void {
  if (!supabaseConfig.url) {
    throw new Error(
      'Missing VITE_SUPABASE_URL environment variable. ' +
      'Please add it to your .env file.'
    );
  }

  if (!supabaseConfig.anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
      'Please add it to your .env file.'
    );
  }
}
