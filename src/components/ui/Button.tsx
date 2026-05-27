import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { buttonPressAnimation } from '../../lib/animations'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-xl hover:shadow-indigo-300 dark:hover:shadow-indigo-900/50',
      secondary:
        'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl',
      success:
        'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl',
      danger:
        'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl',
      ghost:
        'bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
      outline:
        'bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <motion.button
        ref={ref}
        type="button"
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...buttonPressAnimation}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
            <span>Lädt...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export default Button
