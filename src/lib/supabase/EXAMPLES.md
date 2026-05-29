/**
 * Example: Using Supabase in the Language Learning App
 * 
 * This file demonstrates how to use the Supabase client setup
 * in your React components and stores.
 */

// ============================================================================
// Example 1: Using Supabase in a React Component
// ============================================================================

/*
import { useEffect, useState } from 'react';
import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';

export function UserProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const supabase = getSupabase();
      const { data, error } = await executeSupabaseQuery(
        () => supabase
          .from('progress')
          .select('*')
          .eq('user_id', 'current-user-id')
          .single(),
        'fetchProgress'
      );

      if (error) {
        console.error('Failed to fetch:', error);
      } else {
        setProgress(data);
      }
      setLoading(false);
    };

    fetchProgress();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!progress) return <div>No progress found</div>;

  return (
    <div>
      <h2>Level: {progress.current_level}</h2>
      <p>XP: {progress.xp_points}</p>
      <p>Streak: {progress.daily_streak}</p>
    </div>
  );
}
*/

// ============================================================================
// Example 2: Real-Time Subscriptions
// ============================================================================

/*
import { useEffect, useState } from 'react';
import { subscribeToTable, unsubscribeFromTable } from '@/lib/supabase';

export function RealtimeProgress() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const subscription = subscribeToTable(
      'progress',
      (payload) => {
        console.log('Real-time update:', payload);
        setUpdates(prev => [...prev, payload]);
      }
    );

    return () => {
      unsubscribeFromTable(subscription);
    };
  }, []);

  return (
    <div>
      <h2>Recent Updates:</h2>
      <ul>
        {updates.map((update, idx) => (
          <li key={idx}>{JSON.stringify(update.new)}</li>
        ))}
      </ul>
    </div>
  );
}
*/

// ============================================================================
// Example 3: Inserting Data
// ============================================================================

/*
import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';

async function saveVocabularyProgress(userId: string, wordId: string) {
  const supabase = getSupabase();
  const { data, error } = await executeSupabaseQuery(
    () => supabase
      .from('vocabulary')
      .insert([
        {
          user_id: userId,
          word_id: wordId,
          is_learned: true,
          times_reviewed: 1,
        }
      ])
      .select()
      .single(),
    'saveVocabularyProgress'
  );

  if (error) {
    console.error('Failed to save:', error);
    return null;
  }

  return data;
}
*/

// ============================================================================
// Example 4: Updating Data
// ============================================================================

/*
import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';

async function updateDailyStreak(userId: string, newStreak: number) {
  const supabase = getSupabase();
  const { data, error } = await executeSupabaseQuery(
    () => supabase
      .from('progress')
      .update({
        daily_streak: newStreak,
        last_activity_date: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', userId)
      .select()
      .single(),
    'updateDailyStreak'
  );

  if (error) {
    console.error('Failed to update:', error);
    return null;
  }

  return data;
}
*/

// ============================================================================
// Example 5: Error Handling Pattern
// ============================================================================

/*
import { getSupabase, executeSupabaseQuery, handleSupabaseError } from '@/lib/supabase';

async function robustQuery(userId: string) {
  const supabase = getSupabase();

  try {
    const { data, error } = await executeSupabaseQuery(
      () => supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single(),
      'robustQuery'
    );

    if (error) {
      // Error is already handled, you can still access details
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
      console.error(`HTTP status: ${error.status}`);
      return null;
    }

    return data;
  } catch (error) {
    // Fallback error handling
    const supabaseError = handleSupabaseError(error);
    console.error('Unexpected error:', supabaseError);
    return null;
  }
}
*/

// ============================================================================
// Example 6: Using with Zustand Store
// ============================================================================

/*
import { create } from 'zustand';
import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';

interface ProgressState {
  progress: any | null;
  loading: boolean;
  error: string | null;
  fetchProgress: (userId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  loading: false,
  error: null,

  fetchProgress: async (userId: string) => {
    set({ loading: true, error: null });

    const supabase = getSupabase();
    const { data, error } = await executeSupabaseQuery(
      () => supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single(),
      'fetchProgress'
    );

    if (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
    } else {
      set({ 
        progress: data, 
        loading: false, 
        error: null 
      });
    }
  },
}));

// Usage:
// const { progress, fetchProgress } = useProgressStore();
// await fetchProgress('user-id');
*/

// ============================================================================
// Type Safety Features
// ============================================================================

/*
The Supabase setup is fully type-safe when your database types are defined.

Once you've generated types from your Supabase schema:

1. TypeScript will ensure you use correct table names
2. Column names are validated at compile-time
3. Insert/Update payloads are type-checked
4. Return types are properly inferred

Example with proper typing:
*/

/*
import { getSupabase, executeSupabaseQuery } from '@/lib/supabase';
import type { Database } from '@/lib/supabase/types';

type UserProgress = Database['public']['Tables']['progress']['Row'];

async function getTypedProgress(userId: string): Promise<UserProgress | null> {
  const supabase = getSupabase();
  const { data, error } = await executeSupabaseQuery(
    () => supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .single(),
    'getTypedProgress'
  );

  return error ? null : data;
}
*/

export {};
