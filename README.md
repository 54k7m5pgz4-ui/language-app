# 🌍 Language Learning App

A modern, AI-powered language learning application built with React, TypeScript, Vite, and Supabase. Learn any language with interactive exercises, AI tutoring, and intelligent spaced repetition.

## 🚀 Features

- **AI Tutor Chat** - Conversational AI with speech recognition and text-to-speech
- **Vocabulary Training** - Spaced repetition system with progress tracking
- **Structured Courses** - Category-based lessons for different topics
- **Progress Tracking** - XP system, streaks, achievements, and daily goals
- **Offline Support** - Local storage for vocabulary and progress
- **Mobile-First Design** - Beautiful responsive UI with dark mode support
- **Gamification** - Badges, levels, and daily challenges

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Speech**: Web Speech API (Recognition & Synthesis)

## 📋 Supabase Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and Anon Key from Settings > API

### 2. Update Environment Variables

Create `.env` file (copy from `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ANTHROPIC_API_KEY=your-claude-api-key
```

### 3. Apply Database Schema

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** > **New query**
3. Copy the entire content from `src/lib/supabase/schema.sql`
4. Paste and run the SQL script
5. Verify all tables are created in the **Table Editor**

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link your project
supabase link --project-id YOUR_PROJECT_ID

# Apply migrations
psql postgresql://postgres:PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres < src/lib/supabase/schema.sql
```

### 4. Schema Overview

The database includes 9 main tables with comprehensive security and performance features:

**Core Tables:**
- **users** - User account info (extends Supabase auth)
- **profiles** - Learning preferences (level, goals, language)
- **progress** - XP, streaks, levels, learning stats
- **achievements** - Earned badges and awards

**Learning Tables:**
- **learning_history** - Completed lessons and scores
- **lessons** - Lesson content and metadata
- **vocabulary** - User vocabulary with SRS tracking

**Interaction Tables:**
- **chat_history** - Conversation history with AI tutor
- **daily_progress** - Daily learning activity tracking

All tables have:
- ✅ Row-Level Security (RLS) policies
- ✅ Automatic `updated_at` timestamps
- ✅ Foreign key constraints with CASCADE delete
- ✅ Performance indexes on frequently queried fields
- ✅ Helper functions for common operations

### 5. Generate TypeScript Types (Optional but Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Generate types from your schema
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

This provides full type-safety for all database queries.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📝 Project Structure

```
src/
├── components/       - React components
├── lib/
│   ├── supabase/     - Supabase client & schema
│   ├── claude.ts     - Claude API integration
│   ├── srs.ts        - Spaced repetition logic
│   └── ...           - Other utilities
├── App.tsx           - Main app component
└── main.tsx          - Entry point
```

## 📚 Usage Examples

### Fetching User Progress

```typescript
import { getSupabase } from '@/lib/supabase';

const supabase = getSupabase();
const { data: progress } = await supabase
  .from('progress')
  .select('*')
  .single();
```

### Adding XP

```typescript
import { getSupabase } from '@/lib/supabase';

const supabase = getSupabase();
await supabase.rpc('add_user_xp', {
  user_id: userId,
  amount: 100
});
```

## 🔐 Security

- All tables use Row-Level Security (RLS)
- Users can only access their own data
- Policies enforce data isolation at the database level
- Foreign key constraints with CASCADE delete
- Authentication via Supabase Auth

## 📖 Documentation

- [Supabase Setup Guide](./src/lib/supabase/SETUP.md)
- [Database Schema](./src/lib/supabase/schema.sql)
- [API Examples](./src/lib/supabase/EXAMPLES.md)
