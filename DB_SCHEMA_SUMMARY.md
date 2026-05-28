# 🗄️ Database Schema - Language Learning App

**Date Created**: 2024
**File Location**: `src/lib/supabase/schema.sql`
**Total Lines**: 501
**Status**: ✅ Complete and Ready to Deploy

---

## 📋 Overview

Complete PostgreSQL database schema for the Language Learning App, optimized for Supabase. The schema includes 9 main tables with comprehensive Row-Level Security (RLS), automatic timestamp updates, performance indexes, and helper functions.

---

## 🏗️ Table Structure

### 1. **users** (Core Authentication)
User account information extending Supabase's built-in `auth.users` table.

**Columns:**
- `id` (UUID, PK) - Matches `auth.users.id`, auto-deleted on auth deletion
- `email` (TEXT, UNIQUE) - User email address
- `full_name` (TEXT) - Display name
- `avatar_url` (TEXT) - Profile picture URL
- `theme` (TEXT) - 'light' or 'dark' mode preference
- `language` (TEXT) - UI language preference (default: 'de')
- `created_at` (TIMESTAMP TZ) - Account creation time
- `updated_at` (TIMESTAMP TZ) - Auto-updated on changes

**Relationships:** One-to-one with profiles, progress; One-to-many with achievements, learning_history, vocabulary, chat_history, daily_progress

---

### 2. **profiles** (Learning Preferences)
Personalized learning configuration for each user.

**Columns:**
- `id` (UUID, PK) - Profile ID
- `user_id` (UUID, FK UNIQUE) - Links to users
- `native_language` (TEXT) - Mother tongue (default: 'de')
- `target_language` (TEXT) - Language being learned (default: 'en')
- `level` (TEXT) - Current level: A1, A2, B1, B2, C1, or C2
- `goal` (TEXT) - Learning goal: Reisen, Alltag, Arbeit, Studium, Business, Auswandern, Prüfung, or Allgemein
- `intensity` (TEXT) - Study intensity: Locker (Casual), Normal, or Intensiv (Intense)
- `bio` (TEXT) - User biography/description
- `created_at` (TIMESTAMP TZ) - Profile creation time
- `updated_at` (TIMESTAMP TZ) - Auto-updated on changes

**Constraints:** 
- UNIQUE on user_id (one profile per user)
- CASCADE delete when user is deleted

---

### 3. **progress** (Learning Statistics)
Aggregated learning progress and gamification metrics.

**Columns:**
- `id` (UUID, PK) - Progress record ID
- `user_id` (UUID, FK UNIQUE) - Links to users
- `xp` (INTEGER, default 0) - Total experience points earned
- `level` (INTEGER, default 1) - Current level (calculated from XP)
- `streak` (INTEGER, default 0) - Days of consecutive learning
- `daily_xp` (INTEGER, default 0) - XP earned today
- `last_active` (DATE) - Last learning session date
- `week_xp` (INTEGER[], default [0,0,0,0,0,0,0]) - XP per day for last 7 days
- `total_words_learned` (INTEGER, default 0) - Cumulative vocabulary count
- `total_lessons_completed` (INTEGER, default 0) - Completed lesson count
- `updated_at` (TIMESTAMP TZ) - Auto-updated on changes

**Constraints:**
- UNIQUE on user_id (one progress record per user)
- All XP/count fields >= 0
- Level >= 1

---

### 4. **achievements** (Badges & Rewards)
User-earned badges and milestones.

**Columns:**
- `id` (UUID, PK) - Achievement record ID
- `user_id` (UUID, FK) - Links to users
- `badge_id` (TEXT) - Badge identifier (e.g., 'first-day', '3-day-streak', '10-words', etc.)
- `earned_at` (TIMESTAMP TZ) - When badge was earned
- **UNIQUE(user_id, badge_id)** - Prevents duplicate badges

**Example Badge IDs:**
- first-day, 3-day-streak, 7-day-streak, 30-day-streak
- 10-words, 50-words, 100-words, 500-words
- first-lesson, 10-lessons, 50-lessons
- 100-xp, 500-xp, 1000-xp
- quick-learner, dedicated-student, polyglot

---

### 5. **learning_history** (Lesson Records)
Detailed history of completed lessons and exercises.

**Columns:**
- `id` (UUID, PK) - History record ID
- `user_id` (UUID, FK) - Links to users
- `lesson_id` (TEXT, FK) - Links to lessons
- `completed_at` (TIMESTAMP TZ) - Completion timestamp
- `score` (INTEGER) - Performance score 0-100
- `duration_seconds` (INTEGER) - Time spent on lesson
- `created_at` (TIMESTAMP TZ) - Record creation time

**Constraints:**
- Score must be between 0 and 100
- Duration must be >= 0

---

### 6. **lessons** (Course Content)
Master table for available lessons and course content.

**Columns:**
- `id` (TEXT, PK) - Lesson identifier (e.g., 'beginner-01', 'restaurant-ordering', etc.)
- `title` (TEXT, NOT NULL) - Lesson title
- `description` (TEXT) - Lesson description/summary
- `category` (TEXT) - Topic category (Restaurant, Travel, Work, etc.)
- `language` (TEXT, NOT NULL) - Target language for this lesson
- `level` (TEXT) - Proficiency level: A1, A2, B1, B2, C1, C2
- `created_at` (TIMESTAMP TZ) - Content creation time

---

### 7. **vocabulary** (Word Database)
Individual words/phrases with Spaced Repetition System (SRS) tracking.

**Columns:**
- `id` (UUID, PK) - Vocabulary entry ID
- `user_id` (UUID, FK, NULLABLE) - Links to users (NULL for shared vocabulary)
- `lesson_id` (TEXT, FK) - Links to parent lesson
- `word` (TEXT) - Word or phrase in target language
- `translation` (TEXT) - Translation to native language
- `language` (TEXT) - Target language code
- `pronunciation` (TEXT) - IPA or phonetic spelling
- `example_sentence` (TEXT) - Context example
- `is_favorited` (BOOLEAN, default FALSE) - User favorite flag
- `is_learned` (BOOLEAN, default FALSE) - Mastery flag
- `repetition_count` (INTEGER, default 0) - Times reviewed
- `last_reviewed` (TIMESTAMP TZ) - Last review date
- `next_review` (TIMESTAMP TZ) - Scheduled next review (SRS)
- `created_at` (TIMESTAMP TZ) - Entry creation time
- `updated_at` (TIMESTAMP TZ) - Auto-updated on changes

**SRS Features:**
- `next_review` field determines review scheduling
- `repetition_count` tracks mastery level
- Indexed for efficient SRS queries

---

### 8. **chat_history** (Tutor Conversations)
Complete history of AI tutor conversations for replay and analysis.

**Columns:**
- `id` (UUID, PK) - Chat message ID
- `user_id` (UUID, FK) - Links to users
- `scenario` (TEXT) - Conversation scenario (Restaurant, Hotel, etc.)
- `role` (TEXT) - 'user' or 'assistant'
- `message` (TEXT) - Message content
- `message_type` (TEXT) - 'text' or 'audio'
- `audio_url` (TEXT) - URL to audio file if applicable
- `created_at` (TIMESTAMP TZ) - Message timestamp

---

### 9. **daily_progress** (Activity Tracking)
Daily summary of learning activity for streaks and insights.

**Columns:**
- `id` (UUID, PK) - Daily record ID
- `user_id` (UUID, FK) - Links to users
- `date` (DATE) - The date this record represents
- `xp_earned` (INTEGER, default 0) - XP earned on this date
- `minutes_studied` (INTEGER, default 0) - Study duration in minutes
- `lessons_completed` (INTEGER, default 0) - Lessons done today
- `goal_reached` (BOOLEAN, default FALSE) - Daily goal achievement
- `created_at` (TIMESTAMP TZ) - Record creation time
- `updated_at` (TIMESTAMP TZ) - Auto-updated on changes
- **UNIQUE(user_id, date)** - One record per user per day

---

## 🔒 Row-Level Security (RLS) Policies

All tables have RLS enabled. Security model:

**User-Isolated Access:**
- Users can only read/write their own data
- `auth.uid()` is used to enforce isolation
- Foreign key constraints cascade delete

**Public Access (Lessons):**
- All authenticated users can read lesson content
- Prevents users from editing shared course material

**Shared Vocabulary:**
- Users can access shared vocabulary (user_id IS NULL)
- Users can access their personal vocabulary
- Only owner can delete personal vocabulary

---

## ⚡ Indexes

**Performance Optimizations:**
- Foreign key columns indexed for fast joins
- Frequently queried fields indexed
- Partial indexes on filtered queries (e.g., favorited items)
- Composite indexes for common query patterns

**Key Indexes:**
```sql
-- Users
idx_users_email
idx_users_created_at

-- Profiles
idx_profiles_user_id
idx_profiles_level
idx_profiles_target_language

-- Progress
idx_progress_user_id
idx_progress_level
idx_progress_last_active

-- Vocabulary SRS
idx_vocabulary_next_review (partial: WHERE next_review IS NOT NULL)
idx_vocabulary_is_favorited (partial: WHERE is_favorited = TRUE)

-- Chat & History
idx_chat_history_user_id
idx_daily_progress_user_date (composite for daily lookups)

-- Learning History
idx_learning_history_user_id
idx_learning_history_lesson_id
idx_learning_history_completed_at
```

---

## ⏰ Auto-Updating Timestamps

**Trigger Function**: `public.update_updated_at_column()`

Automatically updates `updated_at` on any row modification:
- **users** → users_updated_at_trigger
- **profiles** → profiles_updated_at_trigger
- **progress** → progress_updated_at_trigger
- **vocabulary** → vocabulary_updated_at_trigger
- **daily_progress** → daily_progress_updated_at_trigger

---

## 🛠️ Helper Functions

**`get_user_level(user_id UUID)`**
Returns the user's current proficiency level from their profile.

**`get_user_xp(user_id UUID)`**
Returns total XP earned by user.

**`get_user_streak(user_id UUID)`**
Returns current learning streak in days.

**`add_user_xp(user_id UUID, amount INTEGER)`**
Adds XP and increments daily_xp. Updates timestamp.

**`increment_streak(user_id UUID)`**
Increments streak counter and updates last_active date.

**`update_level_from_xp(user_id UUID)`**
Recalculates level based on total XP (formula: level = floor(xp / 1000) + 1, min 1).

---

## 📊 Relationships & Cascades

```
users (1)
  ├─→ (1) profiles
  ├─→ (1) progress
  ├─→ (*) achievements
  ├─→ (*) learning_history
  ├─→ (*) vocabulary
  ├─→ (*) chat_history
  └─→ (*) daily_progress

lessons (1)
  ├─→ (*) learning_history
  └─→ (*) vocabulary
```

**Cascade Delete:** All foreign keys use ON DELETE CASCADE, so deleting a user automatically removes all associated data.

---

## 🚀 Deployment Instructions

### Option 1: Supabase Web Editor (Recommended)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor → New Query
3. Copy entire `schema.sql` file content
4. Paste into editor and click "Run"
5. Verify in Table Editor that all 9 tables exist

### Option 2: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-id YOUR_PROJECT_ID

# Run migration
psql postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres \
  < src/lib/supabase/schema.sql
```

### Option 3: Direct psql

```bash
psql -h db.PROJECT_ID.supabase.co \
     -U postgres \
     -d postgres \
     -f src/lib/supabase/schema.sql
```

---

## 📝 TypeScript Type Generation

After deploying schema, generate types for type-safe queries:

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

This creates comprehensive types for:
- All table schemas
- Joined queries
- Insert/Update/Delete operations
- RPC function signatures

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All 9 tables exist in Supabase dashboard
- [ ] RLS policies are enabled on all tables
- [ ] Triggers fire correctly on updates
- [ ] Foreign keys work correctly
- [ ] Indexes are created and active
- [ ] TypeScript types generated successfully
- [ ] Can query user data with RLS

---

## 🔧 Maintenance & Future Enhancements

**Common Additions:**
- Settings table for app-wide preferences
- Friend requests & user relationships
- Leaderboards for competitive features
- Analytics tracking tables
- Media files (pronunciation audio, lesson images)

**Optimization Opportunities:**
- Materialized views for complex dashboards
- Partitioning for high-volume tables (chat_history, learning_history)
- Archive tables for old data
- Caching layer (Redis) for frequently accessed data

---

## 📖 Related Documentation

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **CLI Reference**: https://supabase.com/docs/reference/cli

---

**Schema Version**: 1.0.0
**Last Updated**: 2024
**Compatibility**: PostgreSQL 12+, Supabase

✅ **Ready for Production Deployment**
