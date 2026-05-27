// Design System: Centralized Design Tokens
// All colors, spacing, shadows, and typography defined here for consistency

export const COLORS = {
  // Primary
  primary: '#6366f1', // Indigo
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',

  // Secondary
  secondary: '#8b5cf6', // Violet
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',

  // Semantic
  success: '#10b981', // Emerald
  successDark: '#059669',
  successLight: '#6ee7b7',

  warning: '#f59e0b', // Amber
  warningDark: '#d97706',
  warningLight: '#fcd34d',

  error: '#ef4444', // Red
  errorDark: '#dc2626',
  errorLight: '#fca5a5',

  // Neutral
  background: '#0f172a', // Dark Navy
  surface: '#1e293b', // Darker Navy
  surface2: '#334155', // Lighter Navy
  border: '#475569', // Gray-Blue
  textPrimary: '#f1f5f9', // Light Gray
  textSecondary: '#cbd5e1', // Medium Gray
  textTertiary: '#94a3b8', // Dim Gray

  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  gradientWarm: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
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
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  glow: `0 0 20px rgba(99, 102, 241, 0.3)`,
}

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  // Font sizes (mobile-first)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
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
  full: '9999px',
}

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
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
