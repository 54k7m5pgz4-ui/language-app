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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
