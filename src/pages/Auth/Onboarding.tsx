import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Globe2, Target, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const GOALS = ['Reisen', 'Alltag', 'Arbeit', 'Studium', 'Business', 'Auswandern', 'Prüfung', 'Allgemein']
const INTENSITIES = ['Locker', 'Normal', 'Intensiv']

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateProfile, loading, status } = useAuthStore()
  const [nativeLanguage, setNativeLanguage] = useState('Deutsch')
  const [targetLanguage, setTargetLanguage] = useState('Englisch')
  const [level, setLevel] = useState(LEVELS[0])
  const [goal, setGoal] = useState(GOALS[1])
  const [intensity, setIntensity] = useState(INTENSITIES[1])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setNativeLanguage(user.nativeLanguage ?? 'Deutsch')
      setTargetLanguage(user.targetLanguage ?? 'Englisch')
      setLevel(user.currentLevel ?? LEVELS[0])
      setGoal(user.learningGoal ?? GOALS[1])
      setIntensity(user.learningIntensity ?? INTENSITIES[1])
    }
  }, [user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    try {
      await updateProfile({
        nativeLanguage,
        targetLanguage,
        currentLevel: level,
        learningGoal: goal,
        learningIntensity: intensity,
      })
      navigate('/', { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Fehler beim Speichern')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/20 p-4">
              <Sparkles size={26} />
            </div>
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-indigo-100">Erste Schritte</p>
              <h1 className="text-3xl font-bold mt-2">Onboarding starten</h1>
            </div>
          </div>
          <p className="mt-4 text-slate-100 text-sm leading-6">
            Wähle deine Lernpräferenzen aus, damit deine Reise mit der App perfekt zu dir passt.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg space-y-4">
          <Input label="Muttersprache" value={nativeLanguage} onChange={e => setNativeLanguage(e.target.value)} placeholder="Deutsch" required />
          <Input label="Zielsprache" value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)} placeholder="Englisch" required />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              <div className="flex items-center justify-between mb-2">
                <span>Level</span>
                <Target size={16} className="text-indigo-500" />
              </div>
              <select className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white" value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              <div className="flex items-center justify-between mb-2">
                <span>Lernziel</span>
                <Globe2 size={16} className="text-indigo-500" />
              </div>
              <select className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white" value={goal} onChange={e => setGoal(e.target.value)}>
                {GOALS.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            <div className="flex items-center justify-between mb-2">
              <span>Intensität</span>
              <Zap size={16} className="text-indigo-500" />
            </div>
            <select className="mt-2 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-900 dark:text-white" value={intensity} onChange={e => setIntensity(e.target.value)}>
              {INTENSITIES.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>

          {message && <p className="text-sm text-red-500">{message}</p>}
          {status && <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>}

          <div className="grid gap-3">
            <Button type="submit" fullWidth isLoading={loading}>
              Starten und synchronisieren
            </Button>
            <Button type="button" fullWidth variant="ghost" onClick={() => navigate('/')}>
              Später anpassen
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
