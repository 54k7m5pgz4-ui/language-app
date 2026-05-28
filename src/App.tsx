import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import AppShell from './components/layout/AppShell'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/ToastProvider'
import PageFallback from './components/PageFallback'
import AuthGuard from './components/AuthGuard'
import { useUserStore } from './store/useUserStore'
import { useProgressStore } from './store/useProgressStore'
import { useVocabStore } from './store/useVocabStore'
import { useAuthStore } from './store/useAuthStore'
import { initializeVocabData } from './lib/initVocab'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const AITutor = lazy(() => import('./pages/AITutor'))
const Course = lazy(() => import('./pages/Course'))
const Vocabulary = lazy(() => import('./pages/Vocabulary'))
const More = lazy(() => import('./pages/More'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Profile = lazy(() => import('./pages/Auth/Profile'))
const Settings = lazy(() => import('./pages/Auth/Settings'))
const Onboarding = lazy(() => import('./pages/Auth/Onboarding'))
const NotFound = lazy(() => import('./pages/NotFound'))
const OfflinePage = lazy(() => import('./pages/Offline'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <AuthGuard><Dashboard /></AuthGuard> },
      { path: 'tutor', element: <AuthGuard><AITutor /></AuthGuard> },
      { path: 'course', element: <AuthGuard><Course /></AuthGuard> },
      { path: 'vocab', element: <AuthGuard><Vocabulary /></AuthGuard> },
      { path: 'more', element: <AuthGuard><More /></AuthGuard> },
      { path: 'profile', element: <AuthGuard><Profile /></AuthGuard> },
      { path: 'settings', element: <AuthGuard><Settings /></AuthGuard> },
      { path: 'onboarding', element: <AuthGuard><Onboarding /></AuthGuard> },
      { path: 'offline', element: <OfflinePage /> },
      { path: '*', element: <NotFound /> },
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

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback={<PageFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  )
}
