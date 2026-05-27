import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  isDarkMode: boolean
  toggleDarkMode: () => void
  applyTheme: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isDarkMode:
        typeof window !== 'undefined'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false,

      toggleDarkMode: () => {
        const next = !get().isDarkMode
        document.documentElement.classList.toggle('dark', next)
        set({ isDarkMode: next })
      },

      applyTheme: () => {
        document.documentElement.classList.toggle('dark', get().isDarkMode)
      },
    }),
    { name: 'user-store' }
  )
)
