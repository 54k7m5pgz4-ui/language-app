import { db } from './db'
import { VOCAB_SEEDS } from './vocabSeeds'

export async function initializeVocabData() {
  try {
    const existingCards = await db.cards.count()

    // Only seed if no cards exist
    if (existingCards === 0) {
      const allCards = Object.values(VOCAB_SEEDS).flat()
      await db.cards.bulkAdd(allCards)
    }
  } catch (error) {
    console.error('Failed to initialize vocab data:', error)
  }
}
