export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type Goal = 'Reisen' | 'Alltag' | 'Arbeit' | 'Studium' | 'Business' | 'Auswandern' | 'Prüfung' | 'Allgemein'
export type Intensity = 'Locker' | 'Normal' | 'Intensiv'

export interface Progress {
  xp: number
  level: number
  streak: number
  lastActiveDate: string
  weekXP: number[]
  totalWordsLearned: number
  lessonsCompleted: string[]
  badges: string[]
  todayXP: number
}

export interface VocabCard {
  id: string
  word: string
  translation: string
  pronunciation: string
  example?: string
  deck: string
  interval: number
  repetitions: number
  easeFactor: number
  nextReview: string
  isFavorite: boolean
  isLearned: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  translation?: string
  grammarNote?: string
  correction?: string
  alternatives?: string[]
  timestamp: number
  isStreaming?: boolean
}

export interface Lesson {
  id: string
  topic: string
  title: string
  completed: boolean
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  type: 'vocab' | 'grammar' | 'listening' | 'writing' | 'quiz'
  question: string
  answer: string
  options?: string[]
}

export interface Badge {
  id: string
  label: string
  emoji: string
  unlockedAt: string
}
