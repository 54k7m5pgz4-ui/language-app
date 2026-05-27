// Centralized animation definitions for consistent motion across the app

export const ANIMATIONS = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { duration: 0.3 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.3 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 },
  },
  scaleInBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  
  // Slide animations
  slideInFromLeft: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
    transition: { duration: 0.35 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 32 },
    transition: { duration: 0.35 },
  },
  
  // Bounce animations
  bounceIn: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  
  // Stagger container for list animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  
  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.25 },
  },
}

// Framer motion variants with delay support
export const getFadeUpVariant = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: { duration: 0.3, delay },
})

export const getScaleInVariant = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, delay },
})

export const getSlideInVariant = (delay = 0, direction: 'left' | 'right' = 'left') => ({
  initial: { opacity: 0, x: direction === 'left' ? -32 : 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: direction === 'left' ? -32 : 32 },
  transition: { duration: 0.35, delay },
})

// Button press animation
export const buttonPressAnimation = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
}

// Card hover animation
export const cardHoverAnimation = {
  whileHover: { y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' },
  transition: { duration: 0.2 },
}

// Tap feedback animation
export const tapFeedback = {
  whileTap: { scale: 0.98 },
}

// Pulse animation for loading states
export const pulseAnimation = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 2, repeat: Infinity },
}

// Shimmer/skeleton animation
export const shimmerAnimation = {
  animate: { backgroundPosition: ['200% 0%', '-200% 0%'] },
  transition: { duration: 2, repeat: Infinity, ease: 'linear' },
}

// Rotation animation
export const rotateAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: 'linear' },
}

// Bounce animation for floating elements
export const floatAnimation = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
}

// Success checkmark animation
export const successCheckAnimation = {
  initial: { scale: 0, rotate: -45 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 200, damping: 20 },
}

// Page transition variants
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}
