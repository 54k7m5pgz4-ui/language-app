import { create } from 'zustand'
import { getAuthService } from '../lib/auth'
import { getSupabaseOrNull, isSupabaseAvailable } from '../lib/supabase/client'
import { useProgressStore } from './useProgressStore'
import { db } from '../lib/db'
import type { UserProfile } from '../lib/auth/authService'
import type { ProfileValidationRules } from '../lib/auth/authValidation'
import type { Progress } from '../types'
import { APP_CONFIG } from '../config/appConfig'

interface AuthStore {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  status: string | null
  lastSyncedAt: string | null
  supabaseConfigured: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<UserProfile>
  signUp: (email: string, password: string, fullName: string) => Promise<UserProfile>
  signOut: () => Promise<void>
  updateProfile: (updates: ProfileValidationRules) => Promise<UserProfile>
  initializeAuth: () => Promise<void>
  syncCloud: () => Promise<void>
}

const authService = getAuthService()

function mapRemoteProgress(progress: Progress, remote: any): Progress {
  if (!remote) {
    return progress
  }

  return {
    xp: Math.max(progress.xp, remote.xp ?? 0),
    level: Math.max(progress.level, remote.level ?? 1),
    streak: Math.max(progress.streak, remote.streak ?? 0),
    lastActiveDate: progress.lastActiveDate || remote.last_active || '',
    weekXP: Array.isArray(remote.week_xp) ? remote.week_xp : progress.weekXP,
    totalWordsLearned: Math.max(progress.totalWordsLearned, remote.total_words_learned ?? 0),
    lessonsCompleted: progress.lessonsCompleted,
    badges: progress.badges,
    todayXP: Math.max(progress.todayXP, remote.daily_xp ?? 0),
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  status: null,
  lastSyncedAt: null,
  supabaseConfigured: isSupabaseAvailable(),

  initializeAuth: async () => {
    set({ loading: true, status: 'Authentifizierung prüfen...', supabaseConfigured: isSupabaseAvailable() })

    try {
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: !!user, initialized: true, status: null })

      if (user && isSupabaseAvailable()) {
        await get().syncCloud()
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, initialized: true, status: null })
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email, password, rememberMe = false) => {
    set({ loading: true, status: 'Anmeldung...' })
    try {
      const { user } = await authService.signIn(email, password, rememberMe)
      set({ user, isAuthenticated: true, status: 'Erfolgreich angemeldet', lastSyncedAt: null })
      await get().syncCloud()
      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen'
      set({ status: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, status: 'Registrierung...' })
    try {
      const { user } = await authService.signUp(email, password, fullName)
      set({ user, isAuthenticated: true, status: 'Konto erstellt', lastSyncedAt: null })
      await get().syncCloud()
      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
      set({ status: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    set({ loading: true, status: 'Abmelden...' })
    try {
      await authService.signOut()
      set({ user: null, isAuthenticated: false, status: 'Abgemeldet', lastSyncedAt: null })
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, status: 'Profil aktualisieren...' })
    try {
      const updatedProfile = await authService.updateProfile(updates)
      set({ user: updatedProfile, status: 'Profil aktualisiert' })
      await get().syncCloud()
      return updatedProfile
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profilaktualisierung fehlgeschlagen'
      set({ status: message })
      throw new Error(message)
    } finally {
      set({ loading: false })
    }
  },

  syncCloud: async () => {
    const user = get().user
    const configured = isSupabaseAvailable()
    set({ supabaseConfigured: configured })

    if (!user) {
      set({ status: 'Kein angemeldeter Nutzer zum Synchronisieren' })
      return
    }

    if (!configured) {
      set({ status: 'Supabase ist lokal nicht konfiguriert. Cloud-Sync ist deaktiviert.' })
      return
    }

    const client = getSupabaseOrNull() as any
    if (!client) {
      set({ status: 'Supabase-Client konnte nicht initialisiert werden. Bitte prüfe die Konfiguration.' })
      return
    }

    set({ loading: true, status: 'Cloud-Sync läuft...' })

    try {
      const progressState = useProgressStore.getState()

      // Ensure user and profile records exist
      await client.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.fullName || null,
          language: 'de',
        },
        { onConflict: 'id' }
      )

      const profilePayload = {
        user_id: user.id,
        native_language: user.nativeLanguage ?? 'de',
        target_language: user.targetLanguage ?? APP_CONFIG.targetLanguage,
        level: user.currentLevel ?? APP_CONFIG.level,
        goal: user.learningGoal ?? APP_CONFIG.goal,
        intensity: user.learningIntensity ?? APP_CONFIG.intensity,
      }

      await client.from('profiles').upsert(profilePayload, { onConflict: 'user_id' })

      const { data: remoteProgress } = await client
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (remoteProgress) {
        const merged = mapRemoteProgress(progressState, remoteProgress)
        useProgressStore.setState({
          xp: merged.xp,
          level: merged.level,
          streak: merged.streak,
          lastActiveDate: merged.lastActiveDate,
          weekXP: merged.weekXP,
          totalWordsLearned: merged.totalWordsLearned,
          todayXP: merged.todayXP,
        })
      }

      await client.from('progress').upsert(
        {
          user_id: user.id,
          xp: progressState.xp,
          level: progressState.level,
          streak: progressState.streak,
          last_active: progressState.lastActiveDate || new Date().toISOString(),
          week_xp: progressState.weekXP,
          total_words_learned: progressState.totalWordsLearned,
          daily_xp: progressState.todayXP,
          total_lessons_completed: progressState.lessonsCompleted.length,
        },
        { onConflict: 'user_id' }
      )

      // Vocab sync: push local cards and custom decks to Supabase, then pull remote cards and merge
      try {
        const allLocalCards = await db.cards.toArray()
        const allCustomMeta = await db.customDecks.toArray()

        // Upsert local cards
        if (allLocalCards.length > 0) {
          const payload = allLocalCards.map(c => ({
            id: c.id,
            user_id: user.id,
            deck: c.deck,
            word: c.word,
            translation: c.translation,
            pronunciation: c.pronunciation || null,
            is_favorite: c.isFavorite || false,
            is_learned: c.isLearned || false,
            next_review: c.nextReview || null,
            interval: c.interval || 0,
            repetitions: c.repetitions || 0,
            ease_factor: c.easeFactor || 0,
          }))

          await client.from('vocab_cards').upsert(payload, { onConflict: 'id' })
        }

        // Upsert custom deck metadata
        if (allCustomMeta.length > 0) {
          const deckPayload = allCustomMeta.map(d => ({ id: d.id, user_id: user.id, label: d.label, emoji: d.emoji, created_at: d.createdAt }))
          await client.from('vocab_decks').upsert(deckPayload, { onConflict: 'id' })
        }

        // Pull remote cards and merge into local DB
        const { data: remoteCards } = await client.from('vocab_cards').select('*').eq('user_id', user.id)
        if (Array.isArray(remoteCards)) {
          const localIds = new Set((await db.cards.toArray()).map(c => c.id))
          const toInsert = remoteCards.filter((rc: any) => !localIds.has(rc.id)).map((rc: any) => ({
            id: rc.id,
            deck: rc.deck,
            word: rc.word || rc.front || '',
            translation: rc.translation || rc.back || '',
            pronunciation: rc.pronunciation || '',
            interval: rc.interval || 0,
            repetitions: rc.repetitions || 0,
            easeFactor: rc.ease_factor || 0,
            nextReview: rc.next_review || null,
            isFavorite: rc.is_favorite || false,
            isLearned: rc.is_learned || false,
          }))

          if (toInsert.length > 0) {
            await db.cards.bulkAdd(toInsert as any)
          }
        }
      } catch (err) {
        console.warn('Vokabel-Sync fehlgeschlagen:', err)
      }

      set({ lastSyncedAt: new Date().toISOString(), status: 'Cloud-Sync abgeschlossen' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cloud-Sync fehlgeschlagen'
      set({ status: message })
      console.error('Cloud sync failed:', error)
    } finally {
      set({ loading: false })
    }
  },
}))
