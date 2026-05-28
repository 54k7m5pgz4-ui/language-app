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
 * Check whether Supabase is configured for the current environment.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey)
}

/**
 * Validate that required environment variables are set
 */
export function validateSupabaseConfig(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    )
  }
}
