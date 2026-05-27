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

  const toggle = (s: Section) => setOpenSection(prev => prev === s ? null : s)

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] bg-indigo-500 text-white rounded-2xl rounded-br-md px-4 py-2.5 shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    )
  }

  /* ── Assistant bubble ── */
  const hasSections = !message.isStreaming && (
    message.translation || message.grammarNote || message.correction || (message.alternatives?.length ?? 0) > 0
  )

  const sections = [
    {
      key: 'translation' as Section,
      icon: Languages,
      label: 'DE',
      content: message.translation,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30',
    },
    {
      key: 'grammar' as Section,
      icon: BookOpen,
      label: 'Gram.',
      content: message.grammarNote,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800/30',
    },
    {
      key: 'correction' as Section,
      icon: Pencil,
      label: 'Korr.',
      content: message.correction,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
    },
    {
      key: 'alternatives' as Section,
      icon: Repeat2,
      label: 'Alt.',
      content: message.alternatives?.join(' · '),
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30',
    },
  ].filter(s => Boolean(s.content))

  const activeSection = sections.find(s => s.key === openSection)

  return (
    <div className="flex gap-2.5 max-w-[90%]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <span className="text-white text-xs font-bold">KI</span>
      </div>

      <div className="flex-1 space-y-2">
        {/* Main bubble */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700/60">
          {message.isStreaming && !message.content ? (
            /* Loading dots */
            <div className="flex gap-1.5 py-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-500"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              {message.content}
              {message.isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-3.5 bg-indigo-500 ml-0.5 align-middle"
                />
              )}
            </p>
          )}
        </div>

        {/* Action pills */}
        {hasSections && (
          <div className="flex flex-wrap gap-1.5">
            {/* Speak button */}
            <button
              onClick={() => speak(message.content, APP_CONFIG.targetLanguageCode, speechMode === 'slow')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-medium"
            >
              <Volume2 size={12} />
              {speechMode === 'slow' ? 'Langsam' : 'Abspielen'}
            </button>

            {/* Section toggles */}
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => toggle(s.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  openSection === s.key
                    ? `bg-indigo-500 text-white shadow-sm`
                    : `bg-slate-100 dark:bg-slate-700 ${s.color} hover:opacity-80`
                }`}
              >
                <s.icon size={11} />
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Expanded section */}
        <AnimatePresence>
          {openSection && activeSection && (
            <motion.div
              key={openSection}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`rounded-xl p-3 border text-sm leading-relaxed ${activeSection.bg}`}>
                {activeSection.key === 'alternatives' ? (
                  <div className="space-y-1">
                    {message.alternatives?.map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">{i + 1}.</span>
                        <span className="text-slate-700 dark:text-slate-300">{a}</span>
                        <button
                          onClick={() => speak(a, APP_CONFIG.targetLanguageCode, speechMode === 'slow')}
                          className="ml-auto flex-shrink-0 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-700 dark:text-slate-300">{activeSection.content}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming indicator */}
        {message.isStreaming && message.content && (
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Loader2 size={11} className="animate-spin" />
            <span className="text-[10px]">Antwort wird generiert…</span>
          </div>
        )}
      </div>
    </div>
  )
}
