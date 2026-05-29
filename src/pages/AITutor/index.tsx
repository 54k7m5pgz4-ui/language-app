import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Trash2, Volume2, VolumeX, Gauge, ChevronDown,
} from 'lucide-react'
import { useTutorStore } from '../../store/useTutorStore'
import { streamTutorMessage, hasApiKey } from '../../lib/claude'
import { speak, stopSpeaking } from '../../lib/tts'
import { startListening, stopListening } from '../../lib/stt'
import { APP_CONFIG } from '../../config/appConfig'
import { useProgressStore } from '../../store/useProgressStore'
import ScenarioSelector from './components/ScenarioSelector'
import ChatBubble from './components/ChatBubble'
import InputBar from './components/InputBar'
import type { ChatMessage } from '../../types'

/* ── API key missing screen ── */
function NoApiKey() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-lg shadow-slate-200 dark:shadow-slate-900">
        🔒
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Der KI-Tutor ist derzeit deaktiviert</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
        Der Claude API-Key ist nicht konfiguriert. Sobald du ihn in deiner <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs">.env</code> Datei hinterlegst,
        steht dir der Tutor wieder vollumfänglich zur Verfügung.
      </p>
      <div className="bg-slate-950/95 dark:bg-slate-800/80 rounded-3xl p-4 text-left w-full max-w-md border border-slate-200/50 dark:border-slate-700">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-2">Schnellstart</p>
        <pre className="bg-slate-900 text-emerald-400 text-xs rounded-2xl p-3 overflow-x-auto">
          VITE_ANTHROPIC_API_KEY=sk-ant-…
        </pre>
      </div>
      <div className="grid gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={() => navigate('/vocab')}
          className="rounded-3xl bg-indigo-600 text-white py-3 font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
        >
          Vokabeltrainer öffnen
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-3xl border border-slate-200 dark:border-slate-700 py-3 font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Zurück zur Startseite
        </button>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 max-w-sm">
        In der Zwischenzeit kannst du deine Lernstatistiken verbessern, Wiederholungen planen und dich auf den nächsten Shadowing-Block vorbereiten.
      </p>
    </div>
  )
}

/* ── Main component ── */
export default function AITutor() {
  const {
    messages, activeScenario, isStreaming,
    speechMode, autoSpeak,
    setScenario, clearScenario, addMessage,
    updateLastAssistantMessage, setStreaming,
    toggleSpeechMode, toggleAutoSpeak, clearChat,
  } = useTutorStore()

  const { addXP } = useProgressStore()

  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showScenarioSelector, setShowScenarioSelector] = useState(!activeScenario)
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamAbortRef = useRef(false)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Core: build API messages from store ──────────────────────────────────
  const buildApiMessages = useCallback(
    (extra?: { role: 'user'; content: string }) => {
      const base = messages
        .filter(m => !m.isStreaming && m.content)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
      return extra ? [...base, extra] : base
    },
    [messages],
  )

  // ── Send a message (user text or silent scenario-start trigger) ──────────
  const sendMessage = useCallback(
    async (userText: string, isSilent = false) => {
      if (isStreaming) return
      streamAbortRef.current = false

      // Add user bubble (only for non-silent messages)
      if (!isSilent) {
        const userMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: userText,
          timestamp: Date.now(),
        }
        addMessage(userMsg)
        addXP(5)
      }

      // Add assistant loading bubble
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: Date.now(),
      })
      setStreaming(true)

      const apiMessages = isSilent
        ? [{ role: 'user' as const, content: userText }]
        : buildApiMessages({ role: 'user', content: userText })

      await streamTutorMessage({
        messages: apiMessages,
        scenario: activeScenario?.label,
        onDelta: (mainText) => {
          if (!streamAbortRef.current) {
            updateLastAssistantMessage({ content: mainText })
          }
        },
        onComplete: (parsed) => {
          if (streamAbortRef.current) return
          const noError = parsed.correction.toLowerCase().includes('kein fehler')
          updateLastAssistantMessage({
            content: parsed.main,
            translation: parsed.translation || undefined,
            grammarNote: parsed.grammar || undefined,
            correction: (!noError && parsed.correction) ? parsed.correction : undefined,
            alternatives: parsed.alternatives.length > 0 ? parsed.alternatives : undefined,
            isStreaming: false,
          })
          setStreaming(false)
          addXP(10)

          if (autoSpeak && parsed.main && !streamAbortRef.current) {
            speak(parsed.main, APP_CONFIG.targetLanguageCode, speechMode === 'slow')
          }
        },
        onError: (err) => {
          updateLastAssistantMessage({
            content: `⚠️ Fehler: ${err.message}`,
            isStreaming: false,
          })
          setStreaming(false)
        },
      })
    },
    [
      isStreaming, activeScenario, speechMode, autoSpeak,
      addMessage, updateLastAssistantMessage, setStreaming,
      buildApiMessages, addXP,
    ],
  )

  // ── Scenario selected ────────────────────────────────────────────────────
  const handleSelectScenario = useCallback(
    async (id: string, label: string, emoji: string) => {
      stopSpeaking()
      setScenario({ id, label, emoji })
      setShowScenarioSelector(false)

      // Trigger opening message from AI
      const openingPrompt = id === 'freie'
        ? `Begrüße mich freundlich auf ${APP_CONFIG.targetLanguage} (Niveau ${APP_CONFIG.level}) und lade mich zum Gespräch ein.`
        : `Wir starten die Situation: "${label}". Begrüße mich passend auf ${APP_CONFIG.targetLanguage} (Niveau ${APP_CONFIG.level}) und beginne das Gespräch.`

      await sendMessage(openingPrompt, true)
    },
    [setScenario, sendMessage],
  )

  // ── Handle send ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text || isStreaming) return
    setInputValue('')
    sendMessage(text)
  }, [inputValue, isStreaming, sendMessage])

  // ── Mic toggle ───────────────────────────────────────────────────────────
  const handleToggleMic = useCallback(() => {
    if (isRecording) {
      stopListening()
      setIsRecording(false)
    } else {
      startListening(
        APP_CONFIG.targetLanguageCode,
        (text, isFinal) => {
          setInputValue(text)
          if (isFinal) setIsRecording(false)
        },
        () => setIsRecording(false),
        () => setIsRecording(false),
      )
      setIsRecording(true)
    }
  }, [isRecording])

  // ── Back to selector ─────────────────────────────────────────────────────
  const handleBack = () => {
    streamAbortRef.current = true
    stopSpeaking()
    clearScenario()
    setShowScenarioSelector(true)
    setShowHeaderMenu(false)
  }

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!hasApiKey()) return <NoApiKey />

  if (showScenarioSelector) {
    return <ScenarioSelector onSelect={handleSelectScenario} />
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px - 60px)' }}>

      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Szenario</span>
        </button>

        {activeScenario && (
          <div className="flex items-center gap-1.5">
            <span className="text-base">{activeScenario.emoji}</span>
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 max-w-[140px] truncate">
              {activeScenario.label}
            </span>
          </div>
        )}

        {/* Header menu */}
        <div className="relative">
          <button
            onClick={() => setShowHeaderMenu(p => !p)}
            className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ChevronDown size={16} />
          </button>

          <AnimatePresence>
            {showHeaderMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowHeaderMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  className="absolute right-0 top-8 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 w-52 overflow-hidden"
                >
                  <button
                    onClick={() => { toggleAutoSpeak(); setShowHeaderMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    {autoSpeak ? <Volume2 size={15} className="text-indigo-500" /> : <VolumeX size={15} className="text-slate-400" />}
                    <span>{autoSpeak ? 'Vorlesen: An' : 'Vorlesen: Aus'}</span>
                  </button>
                  <button
                    onClick={() => { toggleSpeechMode(); setShowHeaderMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Gauge size={15} className="text-indigo-500" />
                    <span>Tempo: {speechMode === 'normal' ? 'Normal' : 'Langsam'}</span>
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 mx-3 my-1" />
                  <button
                    onClick={() => { clearChat(); setShowHeaderMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={15} />
                    <span>Gespräch löschen</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} speechMode={speechMode} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isStreaming}
        isRecording={isRecording}
        onToggleMic={handleToggleMic}
      />
    </div>
  )
}
