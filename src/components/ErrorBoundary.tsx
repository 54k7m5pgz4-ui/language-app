import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Placeholder for real error logging
    console.error('Global error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-3xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Etwas ist schiefgelaufen</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Bitte lade die Seite neu oder versuche es später erneut.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Neu laden
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
