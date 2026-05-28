/**
 * Supabase Module Exports
 */

export {
  initializeSupabase,
  getSupabase,
  handleSupabaseError,
  executeSupabaseQuery,
  subscribeToTable,
  unsubscribeFromTable,
} from './client';

export { supabaseConfig, validateSupabaseConfig } from './config';

export type { Database, TableNames, SupabaseError } from './types';
