import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import FlashCard from './FlashCard'
import { sm2Update, type SMQuality } from '../../../lib/srs'
import { db } from '../../../lib/db'
import { useVocabStore } from '../../../store/useVocabStore'
import { useProgressStore } from '../../../store/useProgressStore'
import type { VocabCard } from '../../../types'

interface SessionResult {
  total: number
  correct: number
}

interface Props {
  deckId: string
  deckLabel: string
  onComplete: (result: SessionResult) => void
  onBack: () => void
}

const RATINGS: Array<{ label: string; quality: SMQuality; color: string; bg: string }> = [
  { label: 'Nochmal', quality: 0, color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40' },
  { label: 'Schwer',  quality: 2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40' },
  { label: 'Gut',     quality: 4, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40' },
  { label: 'Einfach', quality: 5, color: 'text-indigo-600 dark:text-indigo-400',   bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40' },
]

export default function StudySession({ deckId, deckLabel, onComplete, onBack }: Props) {
  const [cards, setCards] = useState<VocabCard[]>([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [direction, setDirection] = useState(1)

  const { getDueCards } = useVocabStore()
  const recordReview = useProgressStore((s) => s.recordReview)

  // Load due cards on mount
  useEffect(() => {
    const loadCards = async () => {
      try {
        const dueCards = await getDueCards(deckId)
        setCards(dueCards)
      } finally {
        setLoading(false)
      }
    }
    loadCards()
  }, [deckId, getDueCards])

  if (loading || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">Laden...</p>
        </div>
      </div>
    )
  }

  const card = cards[idx]
  const progress = idx / cards.length
  const isLast = idx === cards.length - 1

  const handleRate = async (quality: SMQuality) => {
    const updated = sm2Update(card, quality)
    await db.cards.update(card.id, updated)

    const isCorrect = quality >= 3
    const newCorrect = correct + (isCorrect ? 1 : 0)
    recordReview(card.deck, card.id, quality, isCorrect)

    if (isLast) {
      onComplete({ total: cards.length, correct: newCorrect })
      return
    }

    setDirection(1)
    setFlipped(false)
    setTimeout(() => setIdx(i => i + 1), 50)
    if (isCorrect) setCorrect(c => c + 1)
  }

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4 gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">{deckLabel}</span>
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {idx + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4 }}
          className="bg-indigo-500 h-full rounded-full"
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col justify-center gap-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.2 }}
          >
            <FlashCard card={card} onFlip={() => setFlipped(true)} />
          </motion.div>
        </AnimatePresence>

        {/* Rating buttons */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-3">
                Wie gut kanntest du das Wort?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map(r => (
                  <motion.button
                    key={r.label}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleRate(r.quality)}
                    className={`rounded-2xl py-3 text-center border font-semibold text-sm transition-all ${r.bg} ${r.color}`}
                  >
                    {r.label}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 dark:text-slate-600 mt-1.5 px-1">
                <span>Wiederholen</span>
                <span>Nächstes Review in Tagen ↑</span>
                <span>Leicht</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flip hint */}
        {!flipped && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Tippe auf die Karte, um die Antwort zu sehen
          </p>
        )}
      </div>
    </div>
  )
}
