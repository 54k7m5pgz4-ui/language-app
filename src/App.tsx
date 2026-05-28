import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/layout/AppShell'
import AuthGuard from './components/AuthGuard'
import Dashboard from './pages/Dashboard'
import AITutor from './pages/AITutor'
import Course from './pages/Course'
import Vocabulary from './pages/Vocabulary'
import More from './pages/More'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Auth/Profile'
import Settings from './pages/Auth/Settings'
import Onboarding from './pages/Auth/Onboarding'
import { useUserStore } from './store/useUserStore'
import { useProgressStore } from './store/useProgressStore'
import { useVocabStore } from './store/useVocabStore'
import { useAuthStore } from './store/useAuthStore'
import { initializeVocabData } from './lib/initVocab'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <AuthGuard><Dashboard /></AuthGuard> },
      { path: 'tutor', element: <AuthGuard><AITutor /></AuthGuard> },
      { path: 'course', element: <AuthGuard><Course /></AuthGuard> },
      { path: 'vocab', element: <AuthGuard><Vocabulary /></AuthGuard> },
      { path: 'more', element: <AuthGuard><More /></AuthGuard> },
      { path: 'profile', element: <AuthGuard><Profile /></AuthGuard> },
      { path: 'settings', element: <AuthGuard><Settings /></AuthGuard> },
      { path: 'onboarding', element: <AuthGuard><Onboarding /></AuthGuard> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
])

export default function App() {
  const applyTheme = useUserStore(s => s.applyTheme)
  const resetWeekIfNeeded = useProgressStore(s => s.resetWeekIfNeeded)
  const initializeDecks = useVocabStore(s => s.initializeDecks)
  const initializeAuth = useAuthStore(s => s.initializeAuth)

  useEffect(() => {
    applyTheme()
    resetWeekIfNeeded()
    initializeVocabData()
    initializeDecks()
    initializeAuth()
  }, [applyTheme, resetWeekIfNeeded, initializeDecks, initializeAuth])

  return <RouterProvider router={router} />
}
