import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import AITutor from './pages/AITutor'
import Course from './pages/Course'
import Vocabulary from './pages/Vocabulary'
import More from './pages/More'
import { useUserStore } from './store/useUserStore'
import { useProgressStore } from './store/useProgressStore'
import { useVocabStore } from './store/useVocabStore'
import { initializeVocabData } from './lib/initVocab'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tutor', element: <AITutor /> },
      { path: 'course', element: <Course /> },
      { path: 'vocab', element: <Vocabulary /> },
      { path: 'more', element: <More /> },
    ],
  },
])

export default function App() {
  const applyTheme = useUserStore(s => s.applyTheme)
  const resetWeekIfNeeded = useProgressStore(s => s.resetWeekIfNeeded)
  const initializeDecks = useVocabStore(s => s.initializeDecks)

  useEffect(() => {
    applyTheme()
    resetWeekIfNeeded()
    initializeVocabData()
    initializeDecks()
  }, [applyTheme, resetWeekIfNeeded, initializeDecks])

  return <RouterProvider router={router} />
}
