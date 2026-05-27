import { NavLink } from 'react-router-dom'
import { Home, Bot, BookOpen, Layers, Grid3x3 } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Start' },
  { to: '/tutor', icon: Bot, label: 'Tutor' },
  { to: '/course', icon: BookOpen, label: 'Kurs' },
  { to: '/vocab', icon: Layers, label: 'Wörter' },
  { to: '/more', icon: Grid3x3, label: 'Mehr' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/50">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 pb-safe">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/25 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="relative z-10"
                >
                  <Icon
                    size={22}
                    className="transition-all"
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </motion.div>
                <span className="relative z-10 text-[10px] font-semibold leading-tight">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
