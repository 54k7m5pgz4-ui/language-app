/**
 * Supabase Setup Guide for Language Learning App
 * 
 * This document outlines how to set up Supabase for the language learning app.
 */

// ============================================================================
// STEP 1: Create a Supabase Project
// ============================================================================
/*
 * 1. Go to https://app.supabase.com
 * 2. Sign in with your GitHub or email
 * 3. Click "New project"
 * 4. Enter project name: "language-app" (or your preference)
 * 5. Create a strong database password
 * 6. Select region closest to your users
 * 7. Click "Create new project"
 * 8. Wait for project to initialize (2-3 minutes)
 */

// ============================================================================
// STEP 2: Get Your API Credentials
// ============================================================================
/*
 * 1. In your Supabase project, go to Settings > API
 * 2. Copy the following values:
 *    - Project URL (starts with https://...)
 *    - anon (public) key
 * 3. Add to your .env file:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 */

// ============================================================================
// STEP 3: Generate TypeScript Types (Optional but Recommended)
// ============================================================================
/*
 * Install Supabase CLI:
 * npm install -g supabase
 * 
 * Generate types from your schema:
 * supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 * 
 * Get PROJECT_ID from: https://app.supabase.com/project/YOUR_PROJECT_ID/settings/general
 */

// ============================================================================
// STEP 4: Set Up Database Schema (Example)
// ============================================================================
/*
 * In Supabase dashboard, go to SQL Editor and run queries like:
 * 
 * -- User progress tracking
 * CREATE TABLE progress (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
 *   xp INTEGER DEFAULT 0,
 *   level INTEGER DEFAULT 1,
 *   streak INTEGER DEFAULT 0,
 *   daily_xp INTEGER DEFAULT 0,
 *   last_active DATE,
 *   week_xp INTEGER[] DEFAULT ARRAY[0,0,0,0,0,0,0],
 *   total_words_learned INTEGER DEFAULT 0,
 *   total_lessons_completed INTEGER DEFAULT 0,
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Vocabulary learned tracking
 * CREATE TABLE vocabulary (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
 *   lesson_id TEXT,
 *   word TEXT NOT NULL,
 *   translation TEXT NOT NULL,
 *   language TEXT NOT NULL,
 *   pronunciation TEXT,
 *   example_sentence TEXT,
 *   is_favorited BOOLEAN DEFAULT FALSE,
 *   is_learned BOOLEAN DEFAULT FALSE,
 *   repetition_count INTEGER DEFAULT 0,
 *   last_reviewed TIMESTAMPTZ,
 *   next_review TIMESTAMPTZ,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 */

// ============================================================================
// STEP 5: Usage in React Components
// ============================================================================
/*
 * Import and use Supabase in your components:
 * 
 * import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';
 * 
 * async function fetchUserProgress() {
 *   const supabase = getSupabase();
 *   const { data, error } = await executeSupabaseQuery(
 *     () => supabase
 *       .from('progress')
 *       .select('*')
 *       .single(),
 *     'fetchUserProgress'
 *   );
 *   
 *   if (error) {
 *     console.error('Failed to fetch progress:', error.message);
 *     return null;
 *   }
 *   
 *   return data;
 * }
 */

// ============================================================================
// STEP 6: Real-Time Subscriptions
// ============================================================================
/*
 * Subscribe to real-time updates:
 * 
 * import { subscribeToTable, unsubscribeFromTable } from '@/lib/supabase';
 * 
 * useEffect(() => {
 *   const subscription = subscribeToTable(
 *     'progress',
 *     (payload) => {
 *       console.log('Update:', payload);
 *       // Update your component state
 *     }
 *   );
 *   
 *   return () => {
 *     unsubscribeFromTable(subscription);
 *   };
 * }, []);
 */

// ============================================================================
// Files Created
// ============================================================================
/*
 * src/lib/supabase/
 * ├── index.ts           - Main exports
 * ├── client.ts          - Client initialization and utilities
 * ├── config.ts          - Configuration and validation
 * └── types.ts           - Database type definitions
 */

// ============================================================================
// Environment Variables
// ============================================================================
/*
 * Required environment variables (in .env):
 * 
 * VITE_SUPABASE_URL=https://your-project.supabase.co
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 * 
 * The variables are validated at runtime to ensure they're set.
 */

// ============================================================================
// Features Implemented
// ============================================================================
/*
 * ✓ Singleton Supabase client instance
 * ✓ Type-safe database operations with generics
 * ✓ Comprehensive error handling
 * ✓ Environment variable validation
 * ✓ Real-time subscription support
 * ✓ TypeScript strict mode support
 * ✓ Auto token refresh and session persistence
 * ✓ Production-ready error logging
 */

export {};
