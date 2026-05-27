import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import type { MotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import { cardHoverAnimation } from '../../lib/animations'

interface CardProps extends MotionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'flat' | 'gradient' | 'glass'
  onClick?: () => void
  interactive?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      onClick,
      interactive = false,
      ...motionProps
    },
    ref,
  ) => {
    const baseClasses = 'rounded-2xl transition-all'

    const variants = {
      default:
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md',
      elevated:
        'bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border-0',
      flat: 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50',
      gradient:
        'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700/30',
      glass:
        'bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg',
    }

    const hoverClasses = interactive ? 'cursor-pointer hover:scale-[1.01]' : ''

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
        onClick={onClick}
        {...(interactive && cardHoverAnimation)}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  },
)

Card.displayName = 'Card'

export default Card
