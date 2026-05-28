import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings2, Save, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { isSupabaseAvailable } from '../../lib/supabase/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const GOALS = ['Reisen', 'Alltag', 'Arbeit', 'Studium', 'Business', 'Auswandern', 'Prüfung', 'Allgemein']
const INTENSITIES = ['Locker', 'Normal', 'Intensiv']

export default function Settings() {
  const navigate = useNavigate()
  const { user, updateProfile, loading, status, syncCloud } = useAuthStore()
  const [fullName, setFullName] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [level, setLevel] = useState(LEVELS[0])
  const [goal, setGoal] = useState(GOALS[1])
  const [intensity, setIntensity] = useState(INTENSITIES[1])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setNativeLanguage(user.nativeLanguage || 'Deutsch')
      setTargetLanguage(user.targetLanguage || 'Englisch')
      setLevel(user.currentLevel || LEVELS[0])
      setGoal(user.learningGoal || GOALS[1])
      setIntensity(user.learningIntensity || INTENSITIES[1])
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg text-center">
          <p className="text-lg font-semibold">Keine Einstellungen verfügbar.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Bitte melde dich an, um dein Profil zu bearbeiten.</p>
          <Button className="mt-6" onClick={() => navigate('/login')}>
            Zur Anmeldung
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    try {
      await updateProfile({
        fullName,
        nativeLanguage,
        targetLanguage,
        currentLevel: level,
        learningGoal: goal,
        learningIntensity: intensity,
      })
      setMessage('Einstellungen gespeichert')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Speichern fehlgeschlagen')
    }
  }

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" icon={<ChevronLeft size={18} />} onClick={() => navigate('/profile')}>
          Zurück
        </Button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Einstellungen</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil & Cloud</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
        <Input
          label="Vollständiger Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Max Mustermann"
          required
        />
        <Input
          label="Muttersprache"
          value={nativeLanguage}
          onChange={e => setNativeLanguage(e.target.value)}
          placeholder="Deutsch"
          required
        />
        <Input
          label="Zielsprache"
          value={targetLanguage}
          onChange={e => setTargetLanguage(e.target.value)}
          placeholder="Englisch"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Level
            <select
              className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              {LEVELS.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Lernziel
            <select
              className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            >
              {GOALS.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Lernintensität
          <select
            className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
            value={intensity}
            onChange={e => setIntensity(e.target.value)}
          >
            {INTENSITIES.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
        {status && <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>}

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Cloud-Sync</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supabase-Status: {isSupabaseAvailable() ? 'Konfiguriert' : 'Nicht konfiguriert'}</p>
            </div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={isSupabaseAvailable()} readOnly className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
            </label>
          </div>

          <Button type="submit" fullWidth icon={<Save size={18} />} isLoading={loading}>
            Änderungen speichern
          </Button>
          <Button fullWidth variant="secondary" icon={<Settings2 size={18} />} type="button" onClick={syncCloud}>
            Cloud-Sync erzwingen
          </Button>
        </div>
      </form>
    </div>
  )
}
