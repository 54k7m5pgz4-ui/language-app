import { create } from 'zustand'
import type { ChatMessage } from '../types'

interface ActiveScenario {
  id: string
  label: string
  emoji: string
}

interface TutorStore {
  messages: ChatMessage[]
  activeScenario: ActiveScenario | null
  isStreaming: boolean
  speechMode: 'normal' | 'slow'
  autoSpeak: boolean

  setScenario: (s: ActiveScenario) => void
  clearScenario: () => void
  addMessage: (msg: ChatMessage) => void
  updateLastAssistantMessage: (updates: Partial<ChatMessage>) => void
  setStreaming: (v: boolean) => void
  toggleSpeechMode: () => void
  toggleAutoSpeak: () => void
  clearChat: () => void
}

export const useTutorStore = create<TutorStore>((set) => ({
  messages: [],
  activeScenario: null,
  isStreaming: false,
  speechMode: 'normal',
  autoSpeak: true,

  setScenario: (s) => set({ activeScenario: s, messages: [] }),
  clearScenario: () => set({ activeScenario: null, messages: [] }),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  updateLastAssistantMessage: (updates) =>
    set((s) => {
      const msgs = [...s.messages]
      let lastIdx = -1
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant') { lastIdx = i; break }
      }
      if (lastIdx >= 0) msgs[lastIdx] = { ...msgs[lastIdx], ...updates }
      return { messages: msgs }
    }),

  setStreaming: (v) => set({ isStreaming: v }),
  toggleSpeechMode: () => set((s) => ({ speechMode: s.speechMode === 'normal' ? 'slow' : 'normal' })),
  toggleAutoSpeak: () => set((s) => ({ autoSpeak: !s.autoSpeak })),
  clearChat: () => set((s) => ({ messages: [], activeScenario: s.activeScenario })),
}))
