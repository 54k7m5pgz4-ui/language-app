import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 text-center gap-4
        ${className}
      `}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="
          w-16 h-16
          bg-slate-100 dark:bg-slate-800
          rounded-3xl
          flex items-center justify-center
          text-4xl
        "
      >
        {icon}
      </motion.div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
          {description}
        </p>
      </div>

      {action && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={action.onClick}
          className="
            mt-4
            px-6 py-2.5
            bg-gradient-to-r from-indigo-500 to-violet-500
            text-white
            rounded-xl
            font-semibold
            text-sm
            shadow-lg
            hover:shadow-xl
            transition-all
          "
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState
