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

export default function TopBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { xp, level } = useProgressStore()

  const isDashboard = pathname === '/'
  const title = PAGE_TITLES[pathname]
  const levelPct = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between max-w-lg mx-auto px-4 h-14">
        {isDashboard ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-50 dark:bg-indigo-900/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  Lv.{level}
                </span>
                <div className="w-16 bg-indigo-100 dark:bg-indigo-800/60 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 0.6 }}
                    className="bg-indigo-500 dark:bg-indigo-400 rounded-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {APP_CONFIG.targetLanguage}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={17} />
              </button>
              <button
                onClick={() => navigate('/more')}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings size={17} />
              </button>
            </div>
          </>
        ) : (
          <h1 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h1>
        )}
      </div>
    </header>
  )
}
