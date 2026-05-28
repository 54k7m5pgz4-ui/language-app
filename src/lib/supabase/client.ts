/**
 * Supabase Client Initialization
 * 
 * Provides a typed, error-handled Supabase client instance
 * with support for real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, SupabaseError } from './types';
import { supabaseConfig, isSupabaseConfigured, validateSupabaseConfig } from './config';

let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Initialize Supabase client (singleton pattern)
 */
export function initializeSupabase(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    validateSupabaseConfig();

    supabaseInstance = createClient<Database>(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
        global: {
          headers: {
            'X-Client-Info': 'language-app',
          },
        },
      }
    );

    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
}

/**
 * Get the Supabase client instance
 * Initializes if not already done
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    return initializeSupabase();
  }
  return supabaseInstance;
}

/**
 * Safe Supabase client accessor that returns null when config is missing.
 */
export function getSupabaseOrNull(): SupabaseClient<Database> | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  return initializeSupabase();
}

/**
 * Indicates whether Supabase is available in the current environment.
 */
export function isSupabaseAvailable(): boolean {
  return isSupabaseConfigured();
}

/**
 * Handle Supabase errors in a standardized way
 */
export function handleSupabaseError(error: unknown): SupabaseError {
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as { message: string; status?: number; code?: string };
    return {
      message: err.message,
      status: err.status,
      code: err.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
}

/**
 * Type-safe wrapper for Supabase queries with error handling
 */
export async function executeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  errorContext?: string
): Promise<{ data: T | null; error: SupabaseError | null }> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      const supabaseError = handleSupabaseError(error);
      console.error(`Supabase error ${errorContext ? `in ${errorContext}` : ''}:`, supabaseError);
      return { data: null, error: supabaseError };
    }

    return { data, error: null };
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    console.error(`Query error ${errorContext ? `in ${errorContext}` : ''}:`, supabaseError);
    return { data: null, error: supabaseError };
  }
}

/**
 * Set up real-time subscriptions
 */
export function subscribeToTable<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: unknown) => void,
  filter?: string
) {
  const client = getSupabase();
  
  const subscription = client
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        ...(filter && { filter }),
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Unsubscribe from a real-time subscription
 */
export async function unsubscribeFromTable(
  subscription: ReturnType<typeof subscribeToTable>
): Promise<void> {
  const client = getSupabase();
  await client.removeChannel(subscription);
}

export default getSupabase;
