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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-1.5 pb-safe">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="relative z-10 text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
