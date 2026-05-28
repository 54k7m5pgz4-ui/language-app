import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply saved theme before first render to prevent flash
try {
  const stored = JSON.parse(localStorage.getItem('user-store') || '{}')
  const isDark = stored?.state?.isDarkMode
  if (isDark === true) {
    document.documentElement.classList.add('dark')
  } else if (isDark === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
} catch {
  // ignore
}

// In development mode, unregister any stale service workers that may still intercept localhost requests.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(reg => reg.unregister()))
      if (registrations.length > 0) {
        console.debug('[DEV] Unregistered stale service workers', registrations.map(reg => reg.scope))
      }
    } catch (error) {
      console.warn('[DEV] Service worker cleanup failed', error)
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
