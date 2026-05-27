import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { SCENARIOS } from '../../../config/appConfig'

interface Props {
  onSelect: (id: string, label: string, emoji: string) => void
}

export default function ScenarioSelector({ onSelect }: Props) {
  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Szenario wählen</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Mit welcher Situation möchtest du heute üben?
        </p>
      </div>

      {/* Free chat option */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('freie', 'Freies Gespräch', '💬')}
        className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white flex items-center gap-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <MessageSquare size={22} />
        </div>
        <div className="text-left">
          <p className="font-bold text-base">Freies Gespräch</p>
          <p className="text-indigo-100 text-sm">Kein vorgegebenes Thema – einfach drauflosreden</p>
        </div>
      </motion.button>

      {/* Scenario grid */}
      <div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-3">
          Gesprächssituationen ({SCENARIOS.length})
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(s.id, s.label, s.emoji)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-3 text-left hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="font-medium text-sm text-slate-700 dark:text-slate-200 leading-snug">
                {s.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
