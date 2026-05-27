// Design System: Centralized Design Tokens
// All colors, spacing, shadows, and typography defined here for consistency

export const COLORS = {
  // Primary
  primary: '#6366f1', // Indigo
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  primaryXLight: '#c7d2fe',

  // Secondary
  secondary: '#8b5cf6', // Violet
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',
  secondaryXLight: '#ddd6fe',

  // Semantic
  success: '#10b981', // Emerald
  successDark: '#059669',
  successLight: '#6ee7b7',
  successXLight: '#d1fae5',

  warning: '#f59e0b', // Amber
  warningDark: '#d97706',
  warningLight: '#fcd34d',
  warningXLight: '#fef3c7',

  error: '#ef4444', // Red
  errorDark: '#dc2626',
  errorLight: '#fca5a5',
  errorXLight: '#fee2e2',

  info: '#3b82f6', // Blue
  infoDark: '#1d4ed8',
  infoLight: '#60a5fa',
  infoXLight: '#dbeafe',

  // Neutral - Light Mode
  backgroundLight: '#ffffff',
  surfaceLight: '#f8fafc',
  surface2Light: '#f1f5f9',
  surface3Light: '#e2e8f0',
  borderLight: '#e2e8f0',
  textPrimaryLight: '#0f172a',
  textSecondaryLight: '#475569',
  textTertiaryLight: '#64748b',

  // Neutral - Dark Mode
  background: '#0f172a', // Dark Navy
  surface: '#1e293b', // Darker Navy
  surface2: '#334155', // Lighter Navy
  surface3: '#475569',
  border: '#475569', // Gray-Blue
  textPrimary: '#f1f5f9', // Light Gray
  textSecondary: '#cbd5e1', // Medium Gray
  textTertiary: '#94a3b8', // Dim Gray

  // Extended Palette for Depth
  neutral50: '#f9fafb',
  neutral100: '#f3f4f6',
  neutral200: '#e5e7eb',
  neutral300: '#d1d5db',
  neutral400: '#9ca3af',
  neutral500: '#6b7280',
  neutral600: '#4b5563',
  neutral700: '#374151',
  neutral800: '#1f2937',
  neutral900: '#111827',

  // Gradients - Enhanced
  gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  gradientPrimaryAlt: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  gradientWarm: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  gradientCool: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  gradientFire: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
  
  // Subtle Gradients for Cards
  gradientCard: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
}

export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  xxl: '3rem', // 48px
}

export const SHADOWS = {
  // Subtle shadows for layering
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -5px rgba(0, 0, 0, 0.1)',
  
  // Depth shadows for cards
  card: '0 4px 20px rgba(0, 0, 0, 0.08)',
  cardHover: '0 20px 40px rgba(0, 0, 0, 0.15)',
  
  // Glow effects
  glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  glowSuccess: '0 0 20px rgba(16, 185, 129, 0.25)',
  glowWarn: '0 0 20px rgba(245, 158, 11, 0.25)',
  glowError: '0 0 20px rgba(239, 68, 68, 0.25)',
  
  // Inset shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  inset: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
}

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    brand: '"Sohne", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Font sizes (mobile-first, expanded)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
}

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Easing functions for specific effects
  bounce: '450ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}

export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}

// Utility functions
export const getResponsiveValue = (mobile: any, tablet?: any, desktop?: any) => ({
  mobile,
  tablet: tablet || mobile,
  desktop: desktop || tablet || mobile,
})

// CSS Variables for Tailwind/Global Styles
export const getCSSVariables = () => ({
  '--color-primary': COLORS.primary,
  '--color-primary-dark': COLORS.primaryDark,
  '--color-primary-light': COLORS.primaryLight,
  '--color-secondary': COLORS.secondary,
  '--color-success': COLORS.success,
  '--color-warning': COLORS.warning,
  '--color-error': COLORS.error,
  '--color-background': COLORS.background,
  '--color-surface': COLORS.surface,
  '--color-text-primary': COLORS.textPrimary,
  '--color-text-secondary': COLORS.textSecondary,
  '--shadow-sm': SHADOWS.sm,
  '--shadow-md': SHADOWS.md,
  '--shadow-lg': SHADOWS.lg,
  '--transition-base': TRANSITIONS.base,
})
