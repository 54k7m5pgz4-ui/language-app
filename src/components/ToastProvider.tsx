import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import Toast from './ui/Toast'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  notify: (message: string, type?: ToastItem['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const notify = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts(current => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id))
    }, 4200)
  }, [])

  const contextValue = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
