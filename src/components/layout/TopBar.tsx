import { Bell, Settings } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgressStore } from '../../store/useProgressStore'
import { APP_CONFIG, XP_PER_LEVEL } from '../../config/appConfig'

const PAGE_TITLES: Record<string, string> = {
  '/tutor': 'KI-Tutor',
  '/course': 'Kurs',
  '/vocab': 'Vokabeln',
  '/translate': 'Übersetzer',
  '/alphabet': 'Alphabet',
  '/grammar': 'Grammatik',
  '/listen': 'Hörverständnis',
  '/more': 'Einstellungen',
}

const buttonHoverClasses = 'hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all duration-200'
const buttonBaseClasses = 'w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'

export default function TopBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { xp, level } = useProgressStore()

  const isDashboard = pathname === '/'
  const title = PAGE_TITLES[pathname]
  const levelPct = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50">
      <div className="flex items-center justify-between max-w-lg mx-auto px-4 h-14">
        {isDashboard ? (
          <>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-indigo-100 dark:border-indigo-800/40">
                <span className="text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                  Lv.{level}
                </span>
                <div className="w-16 bg-indigo-100 dark:bg-indigo-800/60 rounded-full h-2 overflow-hidden">
                  <motion.div
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300 rounded-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                {APP_CONFIG.targetLanguage}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${buttonBaseClasses} ${buttonHoverClasses}`}
              >
                <Bell size={18} strokeWidth={1.8} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/more')}
                className={`${buttonBaseClasses} ${buttonHoverClasses}`}
              >
                <Settings size={18} strokeWidth={1.8} />
              </motion.button>
            </motion.div>
          </>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-slate-900 dark:text-white text-lg w-full"
          >
            {title}
          </motion.h1>
        )}
      </div>
    </header>
  )
}
