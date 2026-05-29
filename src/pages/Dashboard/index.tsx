import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Zap, Star, Bot, Layers, Languages, Trophy, BookOpen } from 'lucide-react'
import { useProgressStore } from '../../store/useProgressStore'
import { useVocabStore } from '../../store/useVocabStore'
import { APP_CONFIG, DAILY_GOAL_XP, XP_PER_LEVEL } from '../../config/appConfig'
import { getFadeUpVariant } from '../../lib/animations'

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

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

  const { getTopDueDecks } = useVocabStore()
  const [topDecks, setTopDecks] = useState<Array<{ deckId: string; label: string; emoji: string; total: number; due: number }>>([])
  const [recommendationText, setRecommendationText] = useState('')

  useEffect(() => {
    const loadLearningRecommendations = async () => {
      const dueDecks = await getTopDueDecks()
      setTopDecks(dueDecks.slice(0, 3))

      if (dueDecks.length === 0) {
        setRecommendationText(
          'Dein Lernplan ist aktuell ausgeglichen. Nutze den KI-Tutor für Shadowing oder wiederhole ein Thema deiner Wahl.',
        )
        return
      }

      const topDeck = dueDecks[0]
      setRecommendationText(
        `Fokus heute: ${topDeck.label}. ${topDeck.due} fällige Karte${topDeck.due === 1 ? '' : 'n'} warten auf Wiederholung.`,
      )
    }

    loadLearningRecommendations()
  }, [getTopDueDecks])

  const quickActions = [
    {
      label: 'KI-Tutor',
      icon: Bot,
      gradient: 'from-indigo-500 to-violet-600',
      path: '/tutor',
      shadow: 'shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40',
    },
    {
      label: 'Vokabeln',
      icon: Layers,
      gradient: 'from-emerald-500 to-teal-600',
      path: '/vocab',
      shadow: 'shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40',
    },
    {
      label: 'Übersetzer',
      icon: Languages,
      gradient: 'from-rose-500 to-pink-600',
      path: '/translate',
      shadow: 'shadow-lg shadow-rose-200 dark:shadow-rose-900/40',
    },
  ]

  const stats = [
    { label: 'Wörter', value: totalWordsLearned, emoji: '📚', color: 'text-indigo-500' },
    {
      label: 'Lektionen',
      value: lessonsCompleted.length,
      emoji: '✅',
      color: 'text-emerald-500',
    },
    { label: 'Tage-Serie', value: streak, emoji: '🔥', color: 'text-orange-500' },
  ]

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Greeting */}
      <motion.div {...getFadeUpVariant(0)}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {getGreeting()} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Du lernst{' '}
          <span className="font-semibold text-indigo-500 dark:text-indigo-400">
            {APP_CONFIG.targetLanguage}
          </span>
          {' · '}Level <span className="font-semibold text-indigo-600 dark:text-indigo-300">{APP_CONFIG.level}</span>
        </p>
      </motion.div>

      {/* Hero card: Streak + XP + Level */}
      <motion.div
        {...getFadeUpVariant(0.05)}
        className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-300 dark:shadow-indigo-900/30 border border-indigo-400/30"
      >
        <div className="flex items-center justify-between mb-6">
          {[
            { icon: Flame, iconColor: 'text-orange-300', value: streak, label: 'Tage-Serie' },
            { icon: Zap, iconColor: 'text-yellow-300', value: xp, label: 'XP gesamt' },
            { icon: Star, iconColor: 'text-amber-300', value: level, label: 'Level' },
          ].map(({ icon: Icon, iconColor, value, label }) => (
            <motion.div
              key={label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2.5 border border-white/30">
                <Icon size={20} className={iconColor} strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{value}</div>
                <div className="text-indigo-200 text-[11px] mt-0.5 font-medium">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Level progress bar */}
        <div>
          <div className="flex justify-between text-[11px] text-indigo-200 mb-2 font-medium">
            <span>Level {level}</span>
            <span>
              {xpInLevel} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-2.5 overflow-hidden border border-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelPct}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-white rounded-full shadow-lg"
            />
          </div>
          <div className="text-right text-[10px] text-indigo-200 mt-1.5 font-medium">
            {levelPct}% bis Level {level + 1}
          </div>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        {...getFadeUpVariant(0.1)}
        className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Tagesziel</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {APP_CONFIG.intensity} · {DAILY_GOAL_XP} XP täglich
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{todayXP}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / {DAILY_GOAL_XP}</span>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700/50 rounded-full h-3.5 overflow-hidden border border-slate-200 dark:border-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              goalReached
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50'
                : 'bg-gradient-to-r from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-500/30'
            }`}
          />
        </div>
        {goalReached ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-3 text-center"
          >
            🎉 Tagesziel erreicht!
          </motion.p>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-3 text-right font-medium">
            Noch {DAILY_GOAL_XP - todayXP} XP bis zum Ziel
          </p>
        )}
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        {...getFadeUpVariant(0.15)}
        className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-md"
      >
        <h2 className="font-bold text-slate-900 dark:text-white text-base mb-4">Diese Woche</h2>
        <div className="flex justify-between items-end gap-1">
          {DAYS.map((day, i) => {
            const hasXP = weekXP[i] > 0
            const isToday = i === todayIdx
            const isFuture = i > todayIdx
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                {/* XP bar */}
                <div className="w-7 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" style={{ height: 32 }}>
                  {hasXP && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min((weekXP[i] / DAILY_GOAL_XP) * 100, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      className={`w-full rounded-full mt-auto ${
                        isToday
                          ? 'bg-gradient-to-t from-indigo-500 to-indigo-400 shadow-lg'
                          : 'bg-gradient-to-t from-emerald-400 to-emerald-300'
                      }`}
                      style={{ marginTop: 'auto' }}
                    />
                  )}
                </div>
                {/* Day circle */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isToday && hasXP
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50'
                      : isToday
                      ? 'border-2 border-indigo-400 text-indigo-500 dark:text-indigo-400'
                      : hasXP
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      : isFuture
                      ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {hasXP ? '✓' : day[0]}
                </motion.div>
                <span
                  className={`text-[10px] font-semibold ${
                    isToday
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {day}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Adaptive Learning Path */}
      <motion.div
        {...getFadeUpVariant(0.18)}
        className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-semibold tracking-[0.3em] text-indigo-500 dark:text-indigo-400">Adaptiver Lernpfad</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Empfehlung für heute</h2>
          </div>
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-100">
            {goalReached ? 'Stark unterwegs' : 'Am Ball bleiben'}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {recommendationText}
        </p>

        {topDecks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {topDecks.map((deck) => (
              <div
                key={deck.deckId}
                className="rounded-3xl border border-slate-100 dark:border-slate-700/60 p-4 bg-slate-50 dark:bg-slate-900/75"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{deck.emoji}</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{deck.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{deck.due} fällig · {deck.total} Wörter</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 text-[11px] text-slate-500 dark:text-slate-400">
                  Empfohlen, um deine Wiederholungsserie zu stärken.
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate('/vocab')}
            className="w-full rounded-3xl bg-indigo-500 text-white px-4 py-3 font-semibold shadow-lg shadow-indigo-300/30 hover:bg-indigo-600 transition-colors"
          >
            Mini-Test starten
          </button>
          <button
            onClick={() => navigate('/tutor')}
            className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 px-4 py-3 font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Shadowing & Aussprache üben
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        {...getFadeUpVariant(0.2)}
        className="grid grid-cols-3 gap-3"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl mb-2">{stat.emoji}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Start */}
      <motion.div {...getFadeUpVariant(0.25)}>
        <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3">Schnell starten</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((item) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 text-white flex flex-col items-center gap-2 shadow-lg ${item.shadow} border border-white/20 transition-all`}
            >
              <item.icon size={24} strokeWidth={2} />
              <span className="text-xs font-bold">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Continue Learning */}
      <motion.div {...getFadeUpVariant(0.3)}>
        <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3">Weitermachen</h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          onClick={() => navigate('/course')}
          className="w-full bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-md hover:shadow-lg flex items-center gap-4 text-left transition-all"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-900/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-200 dark:border-indigo-700/40">
            <BookOpen size={22} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm">Kurs fortsetzen</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
              {APP_CONFIG.targetLanguage} · {APP_CONFIG.level} · {APP_CONFIG.goal}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lessonsCompleted.length / 19) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full h-2"
                />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                {lessonsCompleted.length}/19
              </span>
            </div>
          </div>
          <span className="text-slate-400 dark:text-slate-600 text-xl">›</span>
        </motion.button>
      </motion.div>

      {/* Achievements row */}
      <motion.div {...getFadeUpVariant(0.35)}>
        <h2 className="font-bold text-slate-900 dark:text-white text-base mb-3">Errungenschaften</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { emoji: '🌟', label: 'Erster Tag', unlocked: xp > 0 },
            { emoji: '🔥', label: '3 Tage', unlocked: streak >= 3 },
            { emoji: '📚', label: '10 Wörter', unlocked: totalWordsLearned >= 10 },
            { emoji: '🎓', label: 'Lektion 1', unlocked: lessonsCompleted.length >= 1 },
            { emoji: '⚡', label: '100 XP', unlocked: xp >= 100 },
            { emoji: '🏆', label: '7 Tage', unlocked: streak >= 7 },
          ].map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={badge.unlocked ? { scale: 1.05, y: -2 } : {}}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800/40 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 opacity-40'
              }`}
            >
              <span className="text-2xl">{badge.emoji}</span>
              <span
                className={`text-[10px] font-bold text-center w-14 leading-tight ${
                  badge.unlocked
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip of the day */}
      <motion.div
        {...getFadeUpVariant(0.4)}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/40 shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">Tipp des Tages</h3>
            <p className="text-amber-800 dark:text-amber-400 text-xs mt-1 leading-relaxed font-medium">
              Täglich 10 Minuten üben ist effektiver als einmal pro Woche eine Stunde lernen. Regelmäßigkeit schlägt
              Intensität!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demo XP button - shows animations */}
      <motion.div {...getFadeUpVariant(0.45)} className="pb-4">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => addXP(10)}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-2xl py-4 font-bold text-sm shadow-lg shadow-indigo-300 dark:shadow-indigo-900/30 flex items-center justify-center gap-2 border border-indigo-400/30 hover:shadow-xl transition-shadow"
        >
          <Trophy size={20} strokeWidth={2} />
          Demo: +10 XP verdienen
        </motion.button>
      </motion.div>
    </div>
  )
}
