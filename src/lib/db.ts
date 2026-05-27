import Dexie, { type Table } from 'dexie'
import type { VocabCard } from '../types'

export interface CustomDeckMeta {
  id: string
  label: string
  emoji: string
  createdAt: string
}

class VocabDatabase extends Dexie {
  cards!: Table<VocabCard>
  customDecks!: Table<CustomDeckMeta>

  constructor() {
    super('lang-app-v1')
    this.version(1).stores({
      cards: 'id, deck, nextReview',
      customDecks: 'id, createdAt',
    })
  }
}

export const db = new VocabDatabase()
