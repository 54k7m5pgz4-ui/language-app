import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Star } from 'lucide-react'
import { speak } from '../../../lib/tts'
import { APP_CONFIG } from '../../../config/appConfig'
import { db } from '../../../lib/db'
import type { VocabCard } from '../../../types'

interface Props {
  card: VocabCard
  onFlip?: () => void
}

export default function FlashCard({ card, onFlip }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFav, setIsFav] = useState(card.isFavorite)

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      onFlip?.()
    }
  }

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !isFav
    setIsFav(next)
    await db.cards.update(card.id, { isFavorite: next })
  }

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(card.word, APP_CONFIG.targetLanguageCode)
  }

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1200px', height: 280 }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex flex-col items-center justify-center px-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Fav + Speaker row */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFav}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-colors hover:bg-white/30"
            >
              <Star
                size={15}
                className={isFav ? 'fill-yellow-300 text-yellow-300' : 'text-white/60'}
              />
            </button>
            <button
              onClick={playAudio}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Volume2 size={15} className="text-white" />
            </button>
          </div>

          {/* Word */}
          <p className="text-3xl font-bold text-white text-center leading-snug">
            {card.word}
          </p>
          {card.pronunciation && (
            <p className="text-indigo-200 text-sm mt-2 text-center">[{card.pronunciation}]</p>
          )}

          {/* Flip hint */}
          <p className="absolute bottom-4 text-indigo-200 text-xs">
            Tippen zum Umdrehen
          </p>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex flex-col px-6 py-5 shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Speaker top-right */}
          <div className="flex justify-end mb-3">
            <button
              onClick={playAudio}
              className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center"
            >
              <Volume2 size={15} className="text-indigo-500" />
            </button>
          </div>

          {/* Translation */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Übersetzung</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.translation}</p>
            </div>

            {card.example && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-3.5 py-2.5 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-xs text-indigo-400 dark:text-indigo-500 uppercase tracking-wider mb-1">Beispiel</p>
                <p className="text-sm text-indigo-800 dark:text-indigo-200 italic leading-relaxed">
                  „{card.example}"
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
