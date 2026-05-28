import { motion } from 'framer-motion'
import { Moon, Sun, Globe, Target, Zap, UserCircle, Cloud, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'
import { useProgressStore } from '../../store/useProgressStore'
import { useAuthStore } from '../../store/useAuthStore'
import { APP_CONFIG } from '../../config/appConfig'
import Button from '../../components/ui/Button'

export default function More() {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useUserStore()
  const { xp, streak, totalWordsLearned, lessonsCompleted } = useProgressStore()
  const { user, loading, status, lastSyncedAt, syncCloud, signOut } = useAuthStore()

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Einstellungen</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Profil & Erscheinungsbild</p>
      </div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white"
      >
        <p className="text-indigo-200 text-xs font-medium mb-3">Mein Fortschritt</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'XP', value: xp },
            { label: 'Serie', value: `${streak}🔥` },
            { label: 'Wörter', value: totalWordsLearned },
            { label: 'Lektionen', value: lessonsCompleted.length },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-indigo-200 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Erscheinungsbild</h3>
        </div>
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 active:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDarkMode
              ? <Moon size={18} className="text-indigo-400" />
              : <Sun size={18} className="text-amber-500" />
            }
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
          </div>
          <div className={`w-11 h-6 rounded-full transition-all duration-200 ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
            <motion.div
              animate={{ x: isDarkMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5"
            />
          </div>
        </button>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Konto</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Deine Persistenz & Cloud-Synchronisation</p>
          </div>
          <UserCircle size={18} className="text-indigo-500" />
        </div>
        <div className="px-4 py-4 space-y-4">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4 border border-slate-100 dark:border-slate-700/60">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.fullName ?? user?.email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
          </div>
          <div className="grid gap-3">
            <Button fullWidth variant="outline" onClick={() => navigate('/profile')}>
              Profil anzeigen
            </Button>
            <Button fullWidth variant="ghost" onClick={() => navigate('/settings')}>
              Einstellungen
            </Button>
            <Button fullWidth variant="secondary" onClick={syncCloud} isLoading={loading}>
              <Cloud size={16} /> Cloud-Sync
            </Button>
            <Button fullWidth variant="danger" onClick={async () => { await signOut(); navigate('/login') }}>
              <LogOut size={16} /> Abmelden
            </Button>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {status ? `Status: ${status}` : 'Cloud-Status aktuell'}
            <br />
            {lastSyncedAt ? `Zuletzt synchronisiert: ${new Date(lastSyncedAt).toLocaleString('de-DE')}` : 'Noch kein Synchronisationspunkt vorhanden'}
          </div>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Lernprofil</h3>
        </div>
        {[
          { icon: Globe, label: 'Zielsprache', value: user?.targetLanguage ?? APP_CONFIG.targetLanguage },
          { icon: Target, label: 'Level', value: user?.currentLevel ?? APP_CONFIG.level },
          { icon: Target, label: 'Lernziel', value: user?.learningGoal ?? APP_CONFIG.goal },
          { icon: Zap, label: 'Intensität', value: user?.learningIntensity ?? APP_CONFIG.intensity },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/40' : ''}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={15} className="text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</span>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-slate-50 dark:border-slate-700/40">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Zum Ändern: <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">src/config/appConfig.ts</code>
          </p>
        </div>
      </motion.div>

      {/* Coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Weitere Features</h3>
        </div>
        {[
          { label: 'Übersetzer', hint: 'Phase 2' },
          { label: 'Alphabet & Aussprache', hint: 'Phase 3' },
          { label: 'Grammatik-Modul', hint: 'Phase 3' },
          { label: 'Hörverständnis', hint: 'Phase 4' },
          { label: 'Lernplan & Push-Reminder', hint: 'Phase 4' },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3.5 opacity-50 ${i < arr.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/40' : ''}`}
          >
            <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
              {item.hint}
            </span>
          </div>
        ))}
      </motion.div>

      <p className="text-center text-xs text-slate-300 dark:text-slate-700 pb-2">
        Sprachlern-App · v0.1.0 · Phase 1
      </p>
    </div>
  )
}
