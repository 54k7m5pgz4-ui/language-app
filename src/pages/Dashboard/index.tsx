import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Zap, Star, Bot, Layers, Languages, Trophy, BookOpen } from 'lucide-react'
import { useProgressStore } from '../../store/useProgressStore'
import { APP_CONFIG, DAILY_GOAL_XP, XP_PER_LEVEL } from '../../config/appConfig'

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
})

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen'
  if (h < 18) return 'Guten Tag'
  return 'Guten Abend'
}

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { xp, level, streak, weekXP, totalWordsLearned, lessonsCompleted, todayXP, addXP } =
    useProgressStore()

  const xpInLevel = xp % XP_PER_LEVEL
  const levelPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100)
  const dailyPct = Math.min(Math.round((todayXP / DAILY_GOAL_XP) * 100), 100)
  const todayIdx = getTodayIndex()
  const goalReached = todayXP >= DAILY_GOAL_XP

  const quickActions = [
    { label: 'KI-Tutor', icon: Bot, gradient: 'from-indigo-500 to-violet-600', path: '/tutor', shadow: 'shadow-indigo-200 dark:shadow-none' },
    { label: 'Vokabeln', icon: Layers, gradient: 'from-emerald-500 to-teal-600', path: '/vocab', shadow: 'shadow-emerald-200 dark:shadow-none' },
    { label: 'Übersetzer', icon: Languages, gradient: 'from-rose-500 to-pink-600', path: '/translate', shadow: 'shadow-rose-200 dark:shadow-none' },
  ]

  const stats = [
    { label: 'Wörter', value: totalWordsLearned, emoji: '📚', color: 'text-indigo-500' },
    { label: 'Lektionen', value: lessonsCompleted.length, emoji: '✅', color: 'text-emerald-500' },
    { label: 'Tage-Serie', value: streak, emoji: '🔥', color: 'text-orange-500' },
  ]

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">

      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {getGreeting()} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Du lernst{' '}
          <span className="font-semibold text-indigo-500">{APP_CONFIG.targetLanguage}</span>
          {' · '}Level <span className="font-semibold">{APP_CONFIG.level}</span>
        </p>
      </motion.div>

      {/* Hero card: Streak + XP + Level */}
      <motion.div
        {...fadeUp(0.05)}
        className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30"
      >
        <div className="flex items-center justify-between mb-5">
          {[
            { icon: Flame, iconColor: 'text-orange-300', value: streak, label: 'Tage-Serie' },
            { icon: Zap, iconColor: 'text-yellow-300', value: xp, label: 'XP gesamt' },
            { icon: Star, iconColor: 'text-amber-300', value: level, label: 'Level' },
          ].map(({ icon: Icon, iconColor, value, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="bg-white/15 rounded-xl p-2">
                <Icon size={18} className={iconColor} />
              </div>
              <div>
                <div className="text-xl font-bold leading-none">{value}</div>
                <div className="text-indigo-200 text-[11px] mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Level progress bar */}
        <div>
          <div className="flex justify-between text-[11px] text-indigo-200 mb-1.5">
            <span>Level {level}</span>
            <span>{xpInLevel} / {XP_PER_LEVEL} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelPct}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="text-right text-[10px] text-indigo-200 mt-1">{levelPct}% bis Level {level + 1}</div>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        {...fadeUp(0.1)}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Tagesziel</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {APP_CONFIG.intensity} · {DAILY_GOAL_XP} XP täglich
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-900 dark:text-white">{todayXP}</span>
            <span className="text-sm text-slate-400 dark:text-slate-500"> / {DAILY_GOAL_XP} XP</span>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full ${goalReached
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
            }`}
          />
        </div>
        {goalReached ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold mt-2 text-center"
          >
            🎉 Tagesziel erreicht! Weiter so!
          </motion.p>
        ) : (
          <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-2 text-right">
            Noch {DAILY_GOAL_XP - todayXP} XP bis zum Ziel
          </p>
        )}
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        {...fadeUp(0.15)}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Diese Woche</h2>
        <div className="flex justify-between items-end">
          {DAYS.map((day, i) => {
            const hasXP = weekXP[i] > 0
            const isToday = i === todayIdx
            const isFuture = i > todayIdx
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                {/* XP bar */}
                <div className="w-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" style={{ height: 32 }}>
                  {hasXP && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min((weekXP[i] / DAILY_GOAL_XP) * 100, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      className={`w-full rounded-full mt-auto ${isToday
                        ? 'bg-indigo-500'
                        : 'bg-emerald-400 dark:bg-emerald-500'
                      }`}
                      style={{ marginTop: 'auto', position: 'absolute', bottom: 0 }}
                    />
                  )}
                </div>
                {/* Day circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isToday && hasXP
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40'
                      : isToday
                      ? 'border-2 border-indigo-400 text-indigo-500 dark:text-indigo-400'
                      : hasXP
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      : isFuture
                      ? 'bg-slate-50 dark:bg-slate-750 text-slate-300 dark:text-slate-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {hasXP ? '✓' : day[0]}
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {day}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.2)} className="grid grid-cols-3 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/60 shadow-sm text-center"
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick Start */}
      <motion.div {...fadeUp(0.25)}>
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Schnell starten</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(item => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 text-white flex flex-col items-center gap-2 shadow-lg ${item.shadow}`}
            >
              <item.icon size={22} strokeWidth={2} />
              <span className="text-xs font-semibold">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning */}
      <motion.div {...fadeUp(0.3)}>
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Weitermachen</h2>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/course')}
          className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center gap-4 text-left"
        >
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Kurs fortsetzen</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              {APP_CONFIG.targetLanguage} · {APP_CONFIG.level} · {APP_CONFIG.goal}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                <div className="bg-indigo-400 rounded-full h-1.5" style={{ width: `${(lessonsCompleted.length / 19) * 100}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{lessonsCompleted.length}/19</span>
            </div>
          </div>
          <span className="text-slate-300 dark:text-slate-600 text-lg">›</span>
        </motion.button>
      </motion.div>

      {/* Achievements row */}
      <motion.div {...fadeUp(0.35)}>
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Errungenschaften</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { emoji: '🌟', label: 'Erster Tag', unlocked: xp > 0 },
            { emoji: '🔥', label: '3 Tage', unlocked: streak >= 3 },
            { emoji: '📚', label: '10 Wörter', unlocked: totalWordsLearned >= 10 },
            { emoji: '🎓', label: 'Lektion 1', unlocked: lessonsCompleted.length >= 1 },
            { emoji: '⚡', label: '100 XP', unlocked: xp >= 100 },
            { emoji: '🏆', label: '7 Tage', unlocked: streak >= 7 },
          ].map(badge => (
            <div
              key={badge.label}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 opacity-40'
              }`}
            >
              <span className="text-2xl">{badge.emoji}</span>
              <span className={`text-[10px] font-medium text-center w-14 leading-tight ${
                badge.unlocked ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'
              }`}>{badge.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tip of the day */}
      <motion.div
        {...fadeUp(0.4)}
        className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Tipp des Tages</h3>
            <p className="text-amber-700 dark:text-amber-400 text-xs mt-1 leading-relaxed">
              Täglich 10 Minuten üben ist effektiver als einmal pro Woche eine Stunde lernen. Regelmäßigkeit schlägt Intensität!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demo XP button - shows animations */}
      <motion.div {...fadeUp(0.45)} className="pb-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => addXP(10)}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-2xl py-3.5 font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center justify-center gap-2"
        >
          <Trophy size={18} />
          Demo: +10 XP verdienen
        </motion.button>
      </motion.div>
    </div>
  )
}
