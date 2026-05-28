import { CloudOff } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="max-w-xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
          <CloudOff size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Offline-Modus aktiviert</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Die App ist derzeit nicht verbunden. Du kannst trotzdem Inhalte ansehen und später erneut synchronisieren.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
