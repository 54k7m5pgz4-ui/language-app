import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Key } from 'lucide-react'
import { getAuthService } from '../../lib/auth'
import { useAuthStore } from '../../store/useAuthStore'
import { isSupabaseAvailable } from '../../lib/supabase/client'
import { useToast } from '../../components/ToastProvider'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated, initialized, loading, status } = useAuthStore()
  const rememberedEmail = getAuthService().getRememberedEmail() ?? ''
  const supabaseAvailable = isSupabaseAvailable()

  const from = (location.state as { from?: string })?.from || '/'
  const [email, setEmail] = useState(rememberedEmail)
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail)
  const [error, setError] = useState<string | null>(null)

  if (initialized && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const { notify } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await signIn(email, password, rememberMe)
      notify('Anmeldung erfolgreich. Willkommen zurück!', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler bei der Anmeldung'
      setError(message)
      notify(message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <p className="uppercase text-xs tracking-[0.3em] text-indigo-500">Willkommen zurück</p>
          <h1 className="text-3xl font-bold">Anmelden</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Melde dich an, um deinen Fortschritt zu laden und deine Cloud-Daten zu synchronisieren.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          {!supabaseAvailable && (
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              Supabase ist nicht konfiguriert. Lokale Anmeldung funktioniert weiterhin, aber Cloud-Sync ist deaktiviert.
            </div>
          )}
          <Input
            label="E-Mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            placeholder="dein.name@example.com"
            required
          />
          <Input
            label="Passwort"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<Key size={16} />}
            placeholder="Dein Passwort"
            required
          />
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Angemeldet bleiben</span>
            </label>
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Jetzt registrieren
            </Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {status && !error && <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>}

          <Button type="submit" fullWidth isLoading={loading}>
            Anmelden
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 dark:text-slate-500">
          Du kannst dein Konto auch später in den Einstellungen verwalten.
        </div>
      </div>
    </div>
  )
}
