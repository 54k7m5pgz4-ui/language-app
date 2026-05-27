import { motion } from 'framer-motion'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'circle' | 'rect'
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rect',
}) => {
  const borderRadius = {
    text: 'rounded-md',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  }

  return (
    <motion.div
      className={`
        bg-slate-200 dark:bg-slate-700
        ${borderRadius[variant]}
        ${className}
      `}
      style={{
        width,
        height,
        backgroundImage: `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.2) 20%,
          rgba(255, 255, 255, 0) 40%
        )`,
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default Skeleton
