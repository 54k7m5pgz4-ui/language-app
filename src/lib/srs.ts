export type SMQuality = 0 | 2 | 4 | 5   // Again | Hard | Good | Easy

export interface SMCard {
  interval: number      // days until next review
  repetitions: number
  easeFactor: number    // 1.3 – 2.5
}

/** SM-2 algorithm – returns updated card fields + nextReview date string */
export function sm2Update(card: SMCard, quality: SMQuality): SMCard & { nextReview: string; isLearned: boolean } {
  let { interval, repetitions, easeFactor } = card

  if (quality < 3) {
    // Failed – reset progression
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions++
  }

  // Update ease factor (clamp to 1.3 minimum)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  )

  const d = new Date()
  d.setDate(d.getDate() + interval)

  return {
    interval,
    repetitions,
    easeFactor,
    nextReview: d.toISOString().slice(0, 10),
    isLearned: interval >= 21,  // "mastered" after ~3 successful reviews
  }
}

/** Default SM-2 values for a brand-new card */
export function freshCard() {
  return {
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().slice(0, 10),
    isLearned: false,
    isFavorite: false,
  }
}

export const todayStr = () => new Date().toISOString().slice(0, 10)
export const isDue = (nextReview: string) => nextReview <= todayStr()
