import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
}

const iconMap = {
  success: <CheckCircle2 size={18} />,
  error: <AlertTriangle size={18} />,
  info: <Info size={18} />,
}

export default function Toast({ message, type = 'info' }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"
      >
        <span className={`text-slate-900 dark:text-slate-100 ${type === 'error' ? 'text-rose-500' : type === 'success' ? 'text-emerald-500' : 'text-indigo-500'}`}>
          {iconMap[type]}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-200">{message}</span>
      </motion.div>
    </AnimatePresence>
  )
}
