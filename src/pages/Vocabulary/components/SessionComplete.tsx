import { motion } from 'framer-motion'
import { RotateCcw, Home, Zap } from 'lucide-react'

interface Props {
  deckLabel: string
  total: number
  correct: number
  xpEarned: number
  onRestart: () => void
  onBack: () => void
}

export default function SessionComplete({ deckLabel, total, correct, xpEarned, onRestart, onBack }: Props) {
  const pct = Math.round((correct / total) * 100)
  const isPerfect = correct === total

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-5 pb-10">

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg ${
          isPerfect
            ? 'bg-amber-100 dark:bg-amber-900/30 shadow-amber-200 dark:shadow-amber-900/20'
            : 'bg-indigo-100 dark:bg-indigo-900/30 shadow-indigo-200 dark:shadow-indigo-900/20'
        }`}
      >
        {isPerfect ? '🏆' : '✅'}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isPerfect ? 'Perfekt!' : 'Gut gemacht!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{deckLabel}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Karten', value: total, emoji: '🃏' },
          { label: 'Richtig', value: correct, emoji: '✓', color: 'text-emerald-500' },
          { label: 'Quote', value: `${pct}%`, emoji: '📊', color: pct >= 80 ? 'text-emerald-500' : 'text-amber-500' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/60 shadow-sm"
          >
            <div className="text-xl mb-1">{s.emoji}</div>
            <div className={`text-xl font-bold ${s.color ?? 'text-slate-900 dark:text-white'}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
      >
        <Zap size={18} className="text-white" />
        <span className="text-white font-bold">+{xpEarned} XP verdient!</span>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 w-full"
      >
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 text-slate-600 dark:text-slate-300 font-semibold text-sm"
        >
          <Home size={16} />
          Decks
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl py-3.5 text-white font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
        >
          <RotateCcw size={16} />
          Nochmal
        </motion.button>
      </motion.div>
    </div>
  )
}
