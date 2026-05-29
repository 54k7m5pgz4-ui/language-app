import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../lib/db'
import { isDue } from '../lib/srs'
import { VOCAB_DECKS } from '../config/appConfig'
import type { VocabCard } from '../types'

interface VocabStore {
  decks: Record<string, { label: string; emoji: string; cardIds: string[] }>
  customDecks: Record<string, { label: string; emoji: string; cardIds: string[] }>
  isLoading: boolean

  initializeDecks: () => Promise<void>
  getDueCards: (deckId: string) => Promise<VocabCard[]>
  getFavoritesCards: () => Promise<VocabCard[]>
  getDeckStats: (deckId: string) => Promise<{ total: number; learned: number; due: number; favorites: number }>
  getAllStats: () => Promise<{ totalCards: number; totalLearned: number; totalDue: number }>
  getTopDueDecks: () => Promise<Array<{ deckId: string; label: string; emoji: string; total: number; due: number }>>
  createCustomDeck: (topic: string, cards: VocabCard[]) => Promise<void>
}

export const useVocabStore = create<VocabStore>()(
  persist(
    (_set) => ({
      decks: {},
      customDecks: {},
      isLoading: false,

      initializeDecks: async () => {
        _set({ isLoading: true })
        try {
          const allCards = await db.cards.toArray()

          const grouped: Record<string, string[]> = {}
          allCards.forEach(card => {
            if (!grouped[card.deck]) grouped[card.deck] = []
            grouped[card.deck].push(card.id)
          })

          const customMeta = await db.customDecks.toArray()
          const customDecksMap: Record<string, { label: string; emoji: string; cardIds: string[] }> = {}
          customMeta.forEach(m => {
            customDecksMap[m.id] = {
              label: m.label,
              emoji: m.emoji,
              cardIds: grouped[m.id] || [],
            }
          })

          _set({
            decks: Object.keys(grouped).reduce(
              (acc, deckId) => {
                if (!customDecksMap[deckId]) {
                  const builtIn = VOCAB_DECKS.find(d => d.id === deckId)
                  if (builtIn) {
                    acc[deckId] = {
                      label: builtIn.label,
                      emoji: builtIn.emoji,
                      cardIds: grouped[deckId],
                    }
                  }
                }
                return acc
              },
              {} as Record<string, any>,
            ),
            customDecks: customDecksMap,
          })
        } finally {
          _set({ isLoading: false })
        }
      },

      getDueCards: async (deckId: string) => {
        const allCards = await db.cards.where('deck').equals(deckId).toArray()
        return allCards.filter(c => isDue(c.nextReview))
      },

      getFavoritesCards: async () => {
        const allCards = await db.cards.toArray()
        return allCards.filter(c => c.isFavorite)
      },

      getDeckStats: async (deckId: string) => {
        const allCards = await db.cards.where('deck').equals(deckId).toArray()
        const learned = allCards.filter(c => c.isLearned).length
        const due = allCards.filter(c => isDue(c.nextReview)).length
        const favorites = allCards.filter(c => c.isFavorite).length

        return {
          total: allCards.length,
          learned,
          due,
          favorites,
        }
      },

      getAllStats: async () => {
        const allCards = await db.cards.toArray()
        const learned = allCards.filter(c => c.isLearned).length
        const due = allCards.filter(c => isDue(c.nextReview)).length

        return {
          totalCards: allCards.length,
          totalLearned: learned,
          totalDue: due,
        }
      },

      getTopDueDecks: async () => {
        const allCards = await db.cards.toArray()
        const customMeta = await db.customDecks.toArray()
        const customMap: Record<string, { label: string; emoji: string }> = {}
        customMeta.forEach(m => {
          customMap[m.id] = { label: m.label, emoji: m.emoji }
        })

        const byDeck: Record<string, { label: string; emoji: string; total: number; due: number }> = {}

        allCards.forEach(card => {
          if (!byDeck[card.deck]) {
            const builtIn = VOCAB_DECKS.find(d => d.id === card.deck)
            byDeck[card.deck] = {
              label: customMap[card.deck]?.label || builtIn?.label || card.deck,
              emoji: customMap[card.deck]?.emoji || builtIn?.emoji || '📘',
              total: 0,
              due: 0,
            }
          }
          byDeck[card.deck].total += 1
          if (isDue(card.nextReview)) byDeck[card.deck].due += 1
        })

        return Object.entries(byDeck)
          .map(([deckId, data]) => ({ deckId, ...data }))
          .sort((a, b) => b.due - a.due || b.total - a.total)
      },

      createCustomDeck: async (topic: string, cards: VocabCard[]) => {
        const deckId = `custom-${Date.now()}`
        const emoji = '⭐'

        await db.customDecks.add({
          id: deckId,
          label: topic,
          emoji,
          createdAt: new Date().toISOString(),
        })

        const withDeckId = cards.map(c => ({ ...c, deck: deckId }))
        await db.cards.bulkAdd(withDeckId)

        _set(s => ({
          customDecks: {
            ...s.customDecks,
            [deckId]: {
              label: topic,
              emoji,
              cardIds: cards.map(c => c.id),
            },
          },
        }))
      },
    }),
    {
      name: 'vocab-store',
    },
  ),
)
