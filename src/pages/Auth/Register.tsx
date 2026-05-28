import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Key, User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Register() {
  const navigate = useNavigate()
  const { signUp, isAuthenticated, initialized, loading, status } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (initialized && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      await signUp(email, password, fullName)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Registrierung')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <p className="uppercase text-xs tracking-[0.3em] text-indigo-500">Neu bei uns?</p>
          <h1 className="text-3xl font-bold">Registrieren</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Erstelle dein Konto und sichere deinen Lernfortschritt in der Cloud.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <Input
            label="Vollständiger Name"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            icon={<User size={16} />}
            placeholder="Max Mustermann"
            required
          />
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
            placeholder="Starkes Passwort"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {status && !error && <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>}

          <Button type="submit" fullWidth isLoading={loading}>
            Konto erstellen
          </Button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Bereits ein Konto?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Anmelden
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
