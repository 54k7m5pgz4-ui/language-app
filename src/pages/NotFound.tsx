import { Link } from 'react-router-dom'
import { ArrowLeftCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="max-w-xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center">
        <div className="text-indigo-500 mb-4">
          <ArrowLeftCircle size={42} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Seite nicht gefunden</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Die angeforderte Seite existiert nicht oder wurde verschoben.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
