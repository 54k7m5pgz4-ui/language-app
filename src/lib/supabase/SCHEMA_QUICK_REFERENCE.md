# Quick Reference - Database Schema

## Tables at a Glance

| Table | Purpose | Key Fields | Relationships |
|-------|---------|-----------|---|
| **users** | Auth & profile | id, email, full_name, theme, language | Root table |
| **profiles** | Learning config | user_id, level, goal, intensity, target_language | 1-1 to users |
| **progress** | XP & gamification | user_id, xp, level, streak, daily_xp | 1-1 to users |
| **achievements** | Badges earned | user_id, badge_id, earned_at | Many to users |
| **learning_history** | Lesson scores | user_id, lesson_id, score, duration_seconds | Many to users/lessons |
| **lessons** | Course content | id, title, category, level, language | Shared content |
| **vocabulary** | Words & SRS | user_id, lesson_id, word, translation, next_review | Many to users/lessons |
| **chat_history** | AI tutor logs | user_id, role, message, scenario, audio_url | Many to users |
| **daily_progress** | Activity tracking | user_id, date, xp_earned, minutes_studied, goal_reached | Many to users |

## Common Queries

### Get User Profile & Progress

```sql
SELECT 
  u.email,
  u.full_name,
  p.level,
  p.goal,
  pr.xp,
  pr.level,
  pr.streak
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN progress pr ON u.id = pr.user_id
WHERE u.id = $1;
```

### Get User's Vocabulary with SRS

```sql
SELECT id, word, translation, next_review, repetition_count
FROM vocabulary
WHERE user_id = $1 
  AND next_review <= NOW()
ORDER BY next_review ASC
LIMIT 10;
```

### Get Daily Streak History (Last 7 Days)

```sql
SELECT date, xp_earned, goal_reached
FROM daily_progress
WHERE user_id = $1 
  AND date >= CURRENT_DATE - INTERVAL '6 days'
ORDER BY date DESC;
```

### Get User's Recent Chat History

```sql
SELECT created_at, role, message, scenario
FROM chat_history
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 50;
```

### Get User's Completed Lessons

```sql
SELECT 
  lh.lesson_id,
  l.title,
  l.category,
  lh.score,
  lh.duration_seconds,
  lh.completed_at
FROM learning_history lh
JOIN lessons l ON lh.lesson_id = l.id
WHERE lh.user_id = $1
ORDER BY lh.completed_at DESC;
```

### Get All User Achievements

```sql
SELECT badge_id, earned_at
FROM achievements
WHERE user_id = $1
ORDER BY earned_at DESC;
```

## RLS Policies

All user-specific tables use this pattern:

```sql
-- SELECT: Can only see own data
SELECT ... WHERE auth.uid() = user_id

-- INSERT: Must own the data
INSERT WHERE auth.uid() = user_id

-- UPDATE: Must own the data
UPDATE WHERE auth.uid() = user_id

-- DELETE: Must own the data
DELETE WHERE auth.uid() = user_id
```

**Exception:** `lessons` table - public read for all authenticated users

## Helper Functions

```typescript
// Get current level
const level = await supabase.rpc('get_user_level', { user_id });

// Get total XP
const xp = await supabase.rpc('get_user_xp', { user_id });

// Get streak
const streak = await supabase.rpc('get_user_streak', { user_id });

// Add XP (updates daily_xp too)
await supabase.rpc('add_user_xp', { user_id, amount: 100 });

// Increment streak (updates last_active)
await supabase.rpc('increment_streak', { user_id });

// Recalculate level from total XP
await supabase.rpc('update_level_from_xp', { user_id });
```

## Useful Indexes

- **vocabulary.next_review** - Fast SRS scheduling
- **vocabulary.is_favorited** - Quick favorite lookups
- **daily_progress.user_id + date** - Daily activity queries
- **learning_history.completed_at** - Timeline queries
- **achievements.earned_at** - Recent achievements
- **chat_history.created_at** - Recent conversations

## XP & Level System

**Level Formula:**
```
level = floor(total_xp / 1000) + 1
min_level = 1
```

Examples:
- 0-999 XP → Level 1
- 1000-1999 XP → Level 2
- 2000-2999 XP → Level 3
- etc.

## Badge System

Common badge_id patterns:
- `first-day` - First lesson completed
- `3-day-streak` - 3-day streak
- `7-day-streak` - 1 week streak
- `30-day-streak` - 30-day streak
- `10-words` - 10 words learned
- `50-words` - 50 words learned
- `100-words` - 100 words learned
- `dedicated-student` - 100 lessons completed
- `polyglot` - 3+ languages

## Vocabulary States

```typescript
interface VocabularySRS {
  is_learned: boolean;      // Complete mastery
  is_favorited: boolean;    // User favorites
  repetition_count: number; // Review count (0+ means reviewed)
  next_review: Date | null; // When to review next
}
```

## Transaction Examples

```typescript
// Complete a lesson with XP reward
const { error } = await supabase.rpc('complete_lesson', {
  user_id,
  lesson_id,
  score: 85,
  duration_seconds: 600,
  xp_reward: 50
});

// Add achievement
await supabase.from('achievements').insert({
  user_id,
  badge_id: 'first-day',
  earned_at: new Date()
});

// Update SRS review
await supabase.from('vocabulary')
  .update({
    repetition_count: count + 1,
    last_reviewed: new Date(),
    next_review: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
  })
  .eq('id', vocab_id);
```

## Performance Tips

1. **Use indexes** - Always query by indexed fields
2. **Filter early** - Apply WHERE clauses before joins
3. **Limit results** - Use LIMIT 10-50 for pagination
4. **Cache RLS context** - Avoid repeated auth.uid() calls
5. **Batch operations** - Group inserts/updates when possible
6. **Archive old data** - Move old chat_history to archive table

## Useful Queries for Analytics

```sql
-- Top achievements earned
SELECT badge_id, COUNT(*) as earned_count
FROM achievements
GROUP BY badge_id
ORDER BY earned_count DESC;

-- Average level by target language
SELECT target_language, AVG(pr.level) as avg_level, COUNT(*) as users
FROM profiles p
JOIN progress pr ON p.user_id = pr.user_id
GROUP BY p.target_language;

-- Average study time (minutes)
SELECT 
  user_id,
  SUM(minutes_studied) as total_minutes,
  AVG(minutes_studied) as avg_per_day,
  COUNT(*) as study_days
FROM daily_progress
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id;
```

---

See `DB_SCHEMA_SUMMARY.md` for complete documentation.
