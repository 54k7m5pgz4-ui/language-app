import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Languages, BookOpen, Pencil, Repeat2, Loader2 } from 'lucide-react'
import { speak } from '../../../lib/tts'
import { APP_CONFIG } from '../../../config/appConfig'
import type { ChatMessage } from '../../../types'

interface Props {
  message: ChatMessage
  speechMode: 'normal' | 'slow'
}

type Section = 'translation' | 'grammar' | 'correction' | 'alternatives'

export default function ChatBubble({ message, speechMode }: Props) {
  const [openSection, setOpenSection] = useState<Section | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const toggle = (s: Section) => setOpenSection(prev => prev === s ? null : s)

  const handleSpeak = async (text: string, code: string) => {
    setIsSpeaking(true)
    try {
      await speak(text, code, speechMode === 'slow')
    } finally {
      setIsSpeaking(false)
    }
  }

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 border border-indigo-400/50">
          <p className="text-sm leading-relaxed font-medium">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  const hasSections = !message.isStreaming && (
    message.translation || message.grammarNote || message.correction || (message.alternatives?.length ?? 0) > 0
  )

  const sections = [
    {
      key: 'translation' as Section,
      icon: Languages,
      label: 'Übersetzung',
      content: message.translation,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/25 border-blue-200 dark:border-blue-800/50',
      hoverBg: 'bg-blue-500',
    },
    {
      key: 'grammar' as Section,
      icon: BookOpen,
      label: 'Grammatik',
      content: message.grammarNote,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/25 border-violet-200 dark:border-violet-800/50',
      hoverBg: 'bg-violet-500',
    },
    {
      key: 'correction' as Section,
      icon: Pencil,
      label: 'Korrektur',
      content: message.correction,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/25 border-emerald-200 dark:border-emerald-800/50',
      hoverBg: 'bg-emerald-500',
    },
    {
      key: 'alternatives' as Section,
      icon: Repeat2,
      label: 'Alternativen',
      content: message.alternatives?.join(' · '),
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/25 border-amber-200 dark:border-amber-800/50',
      hoverBg: 'bg-amber-500',
    },
  ].filter(s => Boolean(s.content))

  const activeSection = sections.find(s => s.key === openSection)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 max-w-[90%]"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg text-white text-xs font-bold">
        🤖
      </div>

      <div className="flex-1 space-y-2">
        {/* Main bubble */}
        <motion.div
          layout
          className="bg-white dark:bg-slate-800/95 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg shadow-slate-200 dark:shadow-slate-900/30 border border-slate-100 dark:border-slate-700/60 backdrop-blur-sm"
        >
          {message.isStreaming && !message.content ? (
            <div className="flex gap-2 py-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-100 leading-relaxed font-medium">
              {message.content}
              {message.isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0.3] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-indigo-500 ml-1 align-middle rounded"
                />
              )}
            </p>
          )}
        </motion.div>

        {/* Action pills */}
        {hasSections && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSpeak(message.content, APP_CONFIG.targetLanguageCode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {isSpeaking ? (
                <>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <Volume2 size={13} />
                  </motion.span>
                  <span>Spielt…</span>
                </>
              ) : (
                <>
                  <Volume2 size={13} />
                  <span>{speechMode === 'slow' ? 'Langsam' : 'Abspielen'}</span>
                </>
              )}
            </motion.button>

            {sections.map((s, idx) => (
              <motion.button
                key={s.key}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(s.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  openSection === s.key
                    ? `${s.hoverBg} text-white shadow-lg`
                    : `bg-slate-100 dark:bg-slate-700/60 ${s.color} hover:opacity-80`
                }`}
              >
                <s.icon size={13} />
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Expanded section */}
        <AnimatePresence mode="wait">
          {openSection && activeSection && (
            <motion.div
              key={openSection}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className={`rounded-xl p-4 border-2 text-sm leading-relaxed ${activeSection.bg} space-y-2`}>
                {activeSection.key === 'alternatives' ? (
                  <div className="space-y-2">
                    {message.alternatives?.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors group"
                      >
                        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0 font-bold w-5 text-center">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-200 flex-1">{a}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSpeak(a, APP_CONFIG.targetLanguageCode)}
                          className="flex-shrink-0 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Volume2 size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{activeSection.content}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming indicator */}
        {message.isStreaming && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <Loader2 size={12} />
            </motion.div>
            <span>Antwort wird generiert…</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
