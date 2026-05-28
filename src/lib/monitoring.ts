export function logEvent(eventName: string, details?: Record<string, unknown>) {
  if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') return
  console.info('[analytics]', eventName, details ?? {})
}

export function reportError(error: Error, context?: Record<string, unknown>) {
  if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') return
  console.error('[error-report]', error.message, context ?? {})
}

export function logPerformance(metricName: string, value: number, details?: Record<string, unknown>) {
  if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') return
  console.info('[performance]', metricName, value, details ?? {})
}
