# 📋 Database Schema Deployment Checklist

**Status**: ✅ READY FOR DEPLOYMENT  
**Date**: 2024  
**Version**: 1.0.0

---

## Pre-Deployment Checklist

- [ ] Read `DB_SCHEMA_SUMMARY.md` for complete documentation
- [ ] Read `src/lib/supabase/SCHEMA_QUICK_REFERENCE.md` for quick reference
- [ ] Supabase project created at https://app.supabase.com
- [ ] Project URL obtained (Settings > API > Project URL)
- [ ] Anon Key obtained (Settings > API > Anon Key)
- [ ] Environment variables updated in `.env`

---

## Deployment Instructions

### ✅ Step 1: Deploy Database Schema

Choose ONE of the three options:

#### Option A: Supabase Web Editor (Recommended)

```
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Click "+ New Query"
5. Open src/lib/supabase/schema.sql
6. Copy ALL content (Ctrl+A, Ctrl+C)
7. Paste into SQL editor (Ctrl+V)
8. Click "Run" button
9. Wait for completion (no errors should appear)
10. Verify in "Table Editor" that all 9 tables exist
```

#### Option B: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-id YOUR_PROJECT_ID

# Run the schema file
psql postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres \
  < src/lib/supabase/schema.sql

# Verify (should return: CREATE TABLE commands output)
```

#### Option C: Direct psql Connection

```bash
# Get credentials from Supabase dashboard
# Settings > Database > Connection String > psql

psql "postgresql://postgres:YOUR_PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres" \
  -f src/lib/supabase/schema.sql
```

---

### ✅ Step 2: Verify Deployment

In Supabase dashboard, check:

#### 1. Tables Created

Go to **Table Editor** in left sidebar:

- [ ] `users` table exists
- [ ] `profiles` table exists
- [ ] `progress` table exists
- [ ] `achievements` table exists
- [ ] `learning_history` table exists
- [ ] `lessons` table exists
- [ ] `vocabulary` table exists
- [ ] `chat_history` table exists
- [ ] `daily_progress` table exists

Total tables: **9** ✓

#### 2. RLS Enabled

For each table, check **RLS Status** column shows "ON":

- [ ] users - ON
- [ ] profiles - ON
- [ ] progress - ON
- [ ] achievements - ON
- [ ] learning_history - ON
- [ ] lessons - ON
- [ ] vocabulary - ON
- [ ] chat_history - ON
- [ ] daily_progress - ON

#### 3. Indexes Created

Run this query in SQL Editor:

```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Should return **27 indexes** ✓

#### 4. Triggers Created

Run this query in SQL Editor:

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

Should return **5 triggers** ✓

#### 5. Functions Created

Run this query in SQL Editor:

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

Should return **7+ functions** ✓

---

### ✅ Step 3: Generate TypeScript Types

In your terminal, run:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Generate types from your schema
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

This creates TypeScript definitions for:
- All tables
- All columns
- Insert/Update operations
- RPC functions

Verify the file was created:

```bash
ls -l src/lib/supabase/types.ts
# Should show the file with size > 0
```

---

### ✅ Step 4: Test Database Connection

In your React app, test the connection:

```typescript
import { getSupabase } from '@/lib/supabase';

async function testConnection() {
  try {
    const supabase = getSupabase();
    
    // Test 1: Check auth
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Auth user:', user);
    
    // Test 2: Query public table (lessons)
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Query error:', error);
    } else {
      console.log('Connection successful! Lessons table accessible');
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
```

---

## Post-Deployment Checklist

- [ ] All 9 tables visible in Table Editor
- [ ] RLS enabled on all tables
- [ ] 27 indexes created
- [ ] 5 triggers working
- [ ] 7 functions available
- [ ] TypeScript types generated
- [ ] Database connection test passes
- [ ] Environment variables set in `.env`
- [ ] No errors in browser console
- [ ] App can read/write user data

---

## Schema Structure Verification

Run these queries in SQL Editor to verify structure:

### 1. Count all tables

```sql
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

Expected result: **9**

### 2. Verify key columns exist

```sql
-- Check progress table has all required columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'progress'
ORDER BY ordinal_position;
```

Should include: `user_id`, `xp`, `level`, `streak`, `daily_xp`, `week_xp`, `updated_at`

### 3. Verify foreign keys

```sql
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
AND referenced_table_name IS NOT NULL
ORDER BY table_name;
```

Should show relationships to `auth.users` and between tables.

### 4. Verify RLS is enforced

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All should show `t` (true) for RLS enabled.

---

## Testing Gamification System

Test the XP & level system:

```sql
-- Create test progress record
INSERT INTO public.progress (user_id, xp)
VALUES ('00000000-0000-0000-0000-000000000000', 1500);

-- Check level calculation
SELECT xp, level, (xp / 1000 + 1) as calculated_level
FROM public.progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';
```

Should show: Level 2 for 1500 XP

---

## Testing SRS System

Test vocabulary scheduling:

```sql
-- Add test vocabulary
INSERT INTO public.vocabulary (lesson_id, word, translation, language, next_review)
VALUES ('test-001', 'hello', 'hola', 'es', NOW() + INTERVAL '1 day');

-- Query words due for review
SELECT word, translation, next_review
FROM public.vocabulary
WHERE next_review <= NOW() + INTERVAL '2 days';
```

Should return vocabulary entries scheduled for review.

---

## Troubleshooting

### Error: "relation does not exist"

**Cause**: Schema not deployed or table name case issue

**Solution**:
1. Verify all 9 tables exist in Table Editor
2. Check table names are lowercase (PostgreSQL default)
3. Redeploy schema if tables missing

### Error: "permission denied" or "new row violates row-level security"

**Cause**: RLS policies not configured correctly

**Solution**:
1. Check RLS is "ON" for the table in Table Editor
2. Verify you're authenticated with Supabase Auth
3. Check policy allows your user (auth.uid() should match user_id)
4. Restart app to refresh session

### Error: "duplicate key value violates unique constraint"

**Cause**: Trying to insert duplicate data

**Solution**:
1. Check UNIQUE constraints on table (user_id on profiles)
2. Don't insert multiple profiles for same user
3. Use INSERT ... ON CONFLICT for safe upserts

### Schema queries slow

**Cause**: Missing indexes or inefficient queries

**Solution**:
1. Verify 27 indexes were created
2. Query index list: `SELECT * FROM pg_indexes WHERE schemaname = 'public'`
3. Recreate indexes if missing: Re-run schema.sql

---

## Quick Commands Reference

```bash
# Get your project ID
supabase projects list

# Link to project
supabase link --project-id YOUR_PROJECT_ID

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts

# Run migrations
supabase migration up

# Check status
supabase status
```

---

## Next Steps

After successful deployment:

1. **Read the documentation**
   - `DB_SCHEMA_SUMMARY.md` - Complete reference
   - `SCHEMA_QUICK_REFERENCE.md` - Quick lookup

2. **Build your app**
   - Implement user onboarding
   - Create dashboard
   - Build vocabulary trainer
   - Integrate AI tutor

3. **Test thoroughly**
   - Test RLS policies with multiple users
   - Test gamification (XP, levels, streaks)
   - Test SRS scheduling
   - Load test with many records

4. **Monitor performance**
   - Check query times in Supabase dashboard
   - Monitor index usage
   - Archive old chat_history if needed

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **This Project**: See `DB_SCHEMA_SUMMARY.md` for complete reference

---

**✅ Deployment Status: READY**

All files are prepared and documented. Follow the steps above to deploy successfully.
