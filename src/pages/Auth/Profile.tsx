import { useNavigate } from 'react-router-dom'
import { CloudCog, LogOut, UserCircle, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import { APP_CONFIG } from '../../config/appConfig'

export default function Profile() {
  const navigate = useNavigate()
  const { user, lastSyncedAt, status, loading, syncCloud, signOut } = useAuthStore()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg text-center">
          <p className="text-lg font-semibold">Kein Profil geladen.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Bitte melde dich an, um dein Konto zu sehen.</p>
          <Button className="mt-6" onClick={() => navigate('/login')}>
            Zur Anmeldung
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-3xl">
            {user.fullName?.charAt(0).toUpperCase() ?? user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Profil</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.fullName || 'Gastnutzer'}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Cloud-Sync</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Letzter Sync:</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{lastSyncedAt ? new Date(lastSyncedAt).toLocaleString('de-DE') : 'Noch nicht synchronisiert'}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Status</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{status ?? 'Alles aktuell'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <Button fullWidth variant="secondary" icon={<CloudCog size={18} />} onClick={syncCloud} isLoading={loading}>
            Cloud-Sync starten
          </Button>
          <Button fullWidth variant="ghost" icon={<ChevronRight size={18} />} onClick={() => navigate('/settings')}>
            Einstellungen öffnen
          </Button>
          <Button fullWidth variant="danger" icon={<LogOut size={18} />} onClick={async () => { await signOut(); navigate('/login') }}>
            Abmelden
          </Button>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <UserCircle size={24} className="text-indigo-500" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Profilübersicht</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">Deine Lernpräferenzen</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Muttersprache</p>
              <p className="mt-2 font-semibold">{user.nativeLanguage ?? 'Deutsch'}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Zielsprache</p>
              <p className="mt-2 font-semibold">{user.targetLanguage ?? APP_CONFIG.targetLanguage}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Level</p>
              <p className="mt-2 font-semibold">{user.currentLevel ?? APP_CONFIG.level}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Lernziel</p>
              <p className="mt-2 font-semibold">{user.learningGoal ?? APP_CONFIG.goal}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Intensität</p>
              <p className="mt-2 font-semibold">{user.learningIntensity ?? APP_CONFIG.intensity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
