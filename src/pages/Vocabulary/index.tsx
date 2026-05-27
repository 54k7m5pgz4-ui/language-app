import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronRight, Zap } from 'lucide-react'
import { useVocabStore } from '../../store/useVocabStore'
import { VOCAB_DECKS } from '../../config/appConfig'
import StudySession from './components/StudySession'
import SessionComplete from './components/SessionComplete'
import Stats from './components/Stats'
import { useProgressStore } from '../../store/useProgressStore'

type View = 'decks' | 'session' | 'complete' | 'stats'

interface SessionState {
  deckId: string
  deckLabel: string
  total: number
  correct: number
  xpEarned: number
}

export default function Vocabulary() {
  const [view, setView] = useState<View>('decks')
  const [sessionState, setSessionState] = useState<SessionState | null>(null)

  const { decks, getDueCards, getDeckStats, isLoading } = useVocabStore()
  const { addXP } = useProgressStore()

  const [stats, setStats] = useState<Record<string, { due: number; total: number }>>({})

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      const newStats: Record<string, { due: number; total: number }> = {}

      for (const deckId of Object.keys(decks)) {
        const deckStats = await getDeckStats(deckId)
        newStats[deckId] = {
          due: deckStats.due,
          total: deckStats.total,
        }
      }

      setStats(newStats)
    }

    if (Object.keys(decks).length > 0) {
      loadStats()
    }
  }, [decks, getDeckStats])

  const handleStartSession = async (deckId: string) => {
    const deckConfig = VOCAB_DECKS.find(d => d.id === deckId)
    const dueCards = await getDueCards(deckId)

    if (dueCards.length === 0) {
      alert('Keine Karten verfügbar für dieses Deck.')
      return
    }

    setSessionState({
      deckId,
      deckLabel: deckConfig?.label || deckId,
      total: dueCards.length,
      correct: 0,
      xpEarned: 0,
    })
    setView('session')
  }

  const handleSessionComplete = (result: { total: number; correct: number }) => {
    const xpPerCard = 10
    const xpEarned = result.correct * xpPerCard
    addXP(xpEarned)

    setSessionState(prev => prev ? { ...prev, ...result, xpEarned } : null)
    setView('complete')
  }

  // ──────────────── VIEW: DECKS ────────────────
  if (view === 'decks') {
    return (
      <div className="pb-28 space-y-0">
        {/* Header + Stats */}
        <div className="px-4 pt-4 pb-4 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vokabeltrainer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Lerne Wörter mit Spaced-Repetition
          </p>
        </div>

        <Stats />

        <div className="px-4 space-y-4">
          {/* Custom deck input */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={16} className="text-indigo-500" />
              <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">Eigenes Deck erstellen</span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">
              KI generiert automatisch ein Deck zu deinem Thema
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="z.B. Farben, Tiere, Wetter…"
                className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-sm border border-indigo-200 dark:border-indigo-700/50 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                disabled
              />
              <button
                disabled
                className="bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed"
              >
                KI
              </button>
            </div>
            <p className="text-[10px] text-indigo-400 dark:text-indigo-500 mt-2">
              Verfügbar in Phase 3
            </p>
          </div>

          {/* Decks */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Vorgefertigte Decks</h3>
            {isLoading ? (
              <div className="text-center py-6 text-slate-500">Laden...</div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {VOCAB_DECKS.map((deck, i) => {
                  const deckStats = stats[deck.id]
                  const progress = deckStats ? Math.round((deckStats.total - deckStats.due) / deckStats.total * 100) : 0

                  return (
                    <motion.button
                      key={deck.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleStartSession(deck.id)}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {deck.emoji}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{deck.label}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {deckStats ? `${deckStats.total} Wörter · ${deckStats.due} fällig` : `${deck.count} Wörter`}
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1 mt-2">
                          <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                            className="bg-indigo-500 rounded-full h-1"
                          />
                        </div>
                      </div>
                      {deckStats && deckStats.due > 0 && (
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg flex-shrink-0">
                          <Zap size={12} className="text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{deckStats.due}</span>
                        </div>
                      )}
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ──────────────── VIEW: SESSION ────────────────
  if (view === 'session' && sessionState) {
    const handleSessionBack = () => {
      setSessionState(null)
      setView('decks')
    }

    return (
      <StudySession
        deckId={sessionState.deckId}
        deckLabel={sessionState.deckLabel}
        onComplete={handleSessionComplete}
        onBack={handleSessionBack}
      />
    )
  }

  // ──────────────── VIEW: COMPLETE ────────────────
  if (view === 'complete' && sessionState) {
    return (
      <SessionComplete
        deckLabel={sessionState.deckLabel}
        total={sessionState.total}
        correct={sessionState.correct}
        xpEarned={sessionState.xpEarned}
        onRestart={() => handleStartSession(sessionState.deckId)}
        onBack={() => {
          setSessionState(null)
          setView('decks')
        }}
      />
    )
  }

  return null
}
