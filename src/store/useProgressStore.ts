import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { XP_PER_LEVEL } from '../config/appConfig'
import type { Progress } from '../types'

const todayStr = () => new Date().toISOString().slice(0, 10)
const mondayIndex = () => {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

interface ProgressStore extends Progress {
  addXP: (amount: number) => void
  addWord: () => void
  markLessonComplete: (id: string) => void
  addBadge: (id: string) => void
  resetWeekIfNeeded: () => void
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: '',
      weekXP: [0, 0, 0, 0, 0, 0, 0],
      totalWordsLearned: 0,
      lessonsCompleted: [],
      badges: [],
      todayXP: 0,

      addXP: (amount) => {
        const s = get()
        const today = todayStr()

        // Streak logic
        let newStreak = s.streak
        if (s.lastActiveDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          newStreak = s.lastActiveDate === yesterday.toISOString().slice(0, 10)
            ? s.streak + 1
            : 1
        }

        const newXP = s.xp + amount
        const newWeekXP = [...s.weekXP]
        newWeekXP[mondayIndex()] = (newWeekXP[mondayIndex()] || 0) + amount

        set({
          xp: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
          streak: newStreak,
          lastActiveDate: today,
          todayXP: s.lastActiveDate === today ? s.todayXP + amount : amount,
          weekXP: newWeekXP,
        })
      },

      addWord: () => set(s => ({ totalWordsLearned: s.totalWordsLearned + 1 })),

      markLessonComplete: (id) => {
        const s = get()
        if (!s.lessonsCompleted.includes(id)) {
          set({ lessonsCompleted: [...s.lessonsCompleted, id] })
        }
      },

      addBadge: (id) => {
        const s = get()
        if (!s.badges.includes(id)) {
          set({ badges: [...s.badges, id] })
        }
      },

      resetWeekIfNeeded: () => {
        // Called on app start – resets weekXP if it's a new week
        const s = get()
        if (!s.lastActiveDate) return
        const lastDate = new Date(s.lastActiveDate)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / 86400000)
        if (diffDays >= 7) {
          set({ weekXP: [0, 0, 0, 0, 0, 0, 0] })
        }
      },
    }),
    { name: 'progress-store' }
  )
)
