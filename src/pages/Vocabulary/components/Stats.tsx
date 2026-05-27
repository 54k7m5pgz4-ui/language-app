import { motion } from 'framer-motion'
import { BookOpen, Trophy, Zap, Target } from 'lucide-react'
import { useVocabStore } from '../../../store/useVocabStore'
import { useProgressStore } from '../../../store/useProgressStore'
import { useState, useEffect } from 'react'

export default function Stats() {
  const { getAllStats } = useVocabStore()
  const { xp, level } = useProgressStore()

  const [stats, setStats] = useState({
    totalCards: 0,
    totalLearned: 0,
    totalDue: 0,
  })

  useEffect(() => {
    const load = async () => {
      const s = await getAllStats()
      setStats(s)
    }
    load()
  }, [getAllStats])

  const statItems = [
    {
      icon: BookOpen,
      label: 'Gelernte Wörter',
      value: stats.totalLearned,
      color: 'from-blue-500 to-cyan-500',
      emoji: '📚',
    },
    {
      icon: Zap,
      label: 'Aktuelle XP',
      value: xp,
      color: 'from-amber-500 to-orange-500',
      emoji: '⚡',
    },
    {
      icon: Target,
      label: 'Level',
      value: level,
      color: 'from-purple-500 to-pink-500',
      emoji: '🎯',
    },
    {
      icon: Trophy,
      label: 'Zur Wiederholung',
      value: stats.totalDue,
      color: 'from-green-500 to-emerald-500',
      emoji: '🏆',
    },
  ]

  return (
    <div className="px-4 py-6 space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Deine Lernstatistiken</h3>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 shadow-lg text-white`}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-xs opacity-90 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
