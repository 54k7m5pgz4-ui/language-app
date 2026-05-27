import { motion } from 'framer-motion'
import { Lock, ChevronRight } from 'lucide-react'
import { COURSE_TOPICS } from '../../config/appConfig'
import { useProgressStore } from '../../store/useProgressStore'

export default function Course() {
  const { lessonsCompleted } = useProgressStore()

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Strukturierter Kurs</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {lessonsCompleted.length} von {COURSE_TOPICS.length} Themen abgeschlossen
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">Gesamtfortschritt</span>
          <span className="text-indigo-500 font-semibold">
            {Math.round((lessonsCompleted.length / COURSE_TOPICS.length) * 100)}%
          </span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(lessonsCompleted.length / COURSE_TOPICS.length) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
          />
        </div>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-1 gap-2">
        {COURSE_TOPICS.map((topic, i) => {
          const isCompleted = lessonsCompleted.includes(topic.id)
          const isUnlocked = i === 0
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border shadow-sm flex items-center gap-4 transition-all ${
                isUnlocked
                  ? 'border-indigo-200 dark:border-indigo-800/50 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700'
                  : 'border-slate-100 dark:border-slate-700/60 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : isUnlocked
                  ? 'bg-indigo-50 dark:bg-indigo-900/30'
                  : 'bg-slate-100 dark:bg-slate-700/50'
              }`}>
                {topic.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {topic.label}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {isCompleted ? 'Abgeschlossen ✓' : isUnlocked ? 'Bereit zum Lernen' : 'Noch gesperrt'}
                </p>
              </div>
              <div className="flex-shrink-0">
                {isUnlocked ? (
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                ) : (
                  <Lock size={14} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
