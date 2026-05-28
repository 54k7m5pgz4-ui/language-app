-- Language Learning App - Complete Database Schema
-- PostgreSQL Schema with Row-Level Security (RLS)
-- Created for Supabase

-- ============================================================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'de',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  native_language TEXT DEFAULT 'de',
  target_language TEXT DEFAULT 'en',
  level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  goal TEXT DEFAULT 'Alltag' CHECK (goal IN (
    'Reisen', 'Alltag', 'Arbeit', 'Studium', 'Business', 
    'Auswandern', 'Prüfung', 'Allgemein'
  )),
  intensity TEXT DEFAULT 'Normal' CHECK (intensity IN ('Locker', 'Normal', 'Intensiv')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  daily_xp INTEGER DEFAULT 0 CHECK (daily_xp >= 0),
  last_active DATE,
  week_xp INTEGER[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0],
  total_words_learned INTEGER DEFAULT 0 CHECK (total_words_learned >= 0),
  total_lessons_completed INTEGER DEFAULT 0 CHECK (total_lessons_completed >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. ACHIEVEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================================
-- 5. LEARNING HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. LESSONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  language TEXT NOT NULL,
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. VOCABULARY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id),
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  language TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  is_favorited BOOLEAN DEFAULT FALSE,
  is_learned BOOLEAN DEFAULT FALSE,
  repetition_count INTEGER DEFAULT 0 CHECK (repetition_count >= 0),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. CHAT HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scenario TEXT,
  role TEXT CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'audio')),
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. DAILY PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
  minutes_studied INTEGER DEFAULT 0 CHECK (minutes_studied >= 0),
  lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
  goal_reached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_target_language ON public.profiles(target_language);

-- Progress table indexes
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON public.progress(level);
CREATE INDEX IF NOT EXISTS idx_progress_last_active ON public.progress(last_active);

-- Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_id ON public.achievements(badge_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON public.achievements(earned_at);

-- Learning history table indexes
CREATE INDEX IF NOT EXISTS idx_learning_history_user_id ON public.learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_lesson_id ON public.learning_history(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_completed_at ON public.learning_history(completed_at);

-- Vocabulary table indexes
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON public.vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson_id ON public.vocabulary(lesson_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_is_favorited ON public.vocabulary(is_favorited) WHERE is_favorited = TRUE;
CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review ON public.vocabulary(next_review) WHERE next_review IS NOT NULL;

-- Chat history table indexes
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON public.chat_history(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_history_scenario ON public.chat_history(scenario);

-- Daily progress table indexes
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_id ON public.daily_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_date ON public.daily_progress(date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress(user_id, date);

-- Lessons table indexes
CREATE INDEX IF NOT EXISTS idx_lessons_category ON public.lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_language ON public.lessons(language);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON public.lessons(level);

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER users_updated_at_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER progress_updated_at_trigger
  BEFORE UPDATE ON public.progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER vocabulary_updated_at_trigger
  BEFORE UPDATE ON public.vocabulary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER daily_progress_updated_at_trigger
  BEFORE UPDATE ON public.daily_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own user data
CREATE POLICY users_select_policy ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own user data
CREATE POLICY users_update_policy ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own user record (via auth trigger)
CREATE POLICY users_insert_policy ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PROFILES TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own profile
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PROGRESS TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own progress
CREATE POLICY progress_select_policy ON public.progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own progress
CREATE POLICY progress_update_policy ON public.progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own progress
CREATE POLICY progress_insert_policy ON public.progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ACHIEVEMENTS TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own achievements
CREATE POLICY achievements_select_policy ON public.achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own achievements
CREATE POLICY achievements_insert_policy ON public.achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own achievements
CREATE POLICY achievements_delete_policy ON public.achievements
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- LEARNING_HISTORY TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own learning history
CREATE POLICY learning_history_select_policy ON public.learning_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own learning history
CREATE POLICY learning_history_insert_policy ON public.learning_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own learning history
CREATE POLICY learning_history_update_policy ON public.learning_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- LESSONS TABLE - RLS POLICIES
-- ============================================================================

-- Allow all authenticated users to read lessons
CREATE POLICY lessons_select_policy ON public.lessons
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- VOCABULARY TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own vocabulary
CREATE POLICY vocabulary_select_policy ON public.vocabulary
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert their own vocabulary
CREATE POLICY vocabulary_insert_policy ON public.vocabulary
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own vocabulary
CREATE POLICY vocabulary_update_policy ON public.vocabulary
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own vocabulary
CREATE POLICY vocabulary_delete_policy ON public.vocabulary
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CHAT_HISTORY TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own chat history
CREATE POLICY chat_history_select_policy ON public.chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own chat history
CREATE POLICY chat_history_insert_policy ON public.chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own chat history
CREATE POLICY chat_history_delete_policy ON public.chat_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY_PROGRESS TABLE - RLS POLICIES
-- ============================================================================

-- Allow users to read their own daily progress
CREATE POLICY daily_progress_select_policy ON public.daily_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own daily progress
CREATE POLICY daily_progress_insert_policy ON public.daily_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own daily progress
CREATE POLICY daily_progress_update_policy ON public.daily_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's current level
CREATE OR REPLACE FUNCTION public.get_user_level(user_id UUID)
RETURNS TEXT AS $$
  SELECT level FROM public.profiles
  WHERE profiles.user_id = get_user_level.user_id;
$$ LANGUAGE sql STABLE;

-- Function to get user's current XP
CREATE OR REPLACE FUNCTION public.get_user_xp(user_id UUID)
RETURNS INTEGER AS $$
  SELECT xp FROM public.progress
  WHERE progress.user_id = get_user_xp.user_id;
$$ LANGUAGE sql STABLE;

-- Function to get user's streak
CREATE OR REPLACE FUNCTION public.get_user_streak(user_id UUID)
RETURNS INTEGER AS $$
  SELECT streak FROM public.progress
  WHERE progress.user_id = get_user_streak.user_id;
$$ LANGUAGE sql STABLE;

-- Function to increment user XP
CREATE OR REPLACE FUNCTION public.add_user_xp(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.progress
  SET 
    xp = xp + amount,
    daily_xp = daily_xp + amount,
    updated_at = NOW()
  WHERE progress.user_id = add_user_xp.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment streak
CREATE OR REPLACE FUNCTION public.increment_streak(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.progress
  SET 
    streak = streak + 1,
    last_active = CURRENT_DATE,
    updated_at = NOW()
  WHERE progress.user_id = increment_streak.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update level based on XP
CREATE OR REPLACE FUNCTION public.update_level_from_xp(user_id UUID)
RETURNS void AS $$
DECLARE
  current_xp INTEGER;
  new_level INTEGER;
BEGIN
  SELECT xp INTO current_xp FROM public.progress
  WHERE progress.user_id = update_level_from_xp.user_id;
  
  -- Level formula: Every 1000 XP = 1 level (min level 1)
  new_level := GREATEST(1, (current_xp / 1000) + 1);
  
  UPDATE public.progress
  SET 
    level = new_level,
    updated_at = NOW()
  WHERE progress.user_id = update_level_from_xp.user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
