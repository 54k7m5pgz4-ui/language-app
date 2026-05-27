import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, Square } from 'lucide-react'
import { sttSupported } from '../../../lib/stt'
import { APP_CONFIG } from '../../../config/appConfig'

interface Props {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled: boolean
  isRecording: boolean
  onToggleMic: () => void
}

export default function InputBar({ value, onChange, onSend, disabled, isRecording, onToggleMic }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-2.5 pb-safe">
      <div className="flex items-end gap-2 max-w-lg mx-auto">
        {/* Mic button */}
        {sttSupported() && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMic}
            disabled={disabled && !isRecording}
            className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Square size={16} />
              </motion.div>
            ) : (
              <Mic size={18} />
            )}
          </motion.button>
        )}

        {/* Text input */}
        <div className={`flex-1 rounded-2xl border transition-colors overflow-hidden ${
          isRecording
            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
        }`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              isRecording
                ? `🎙 Sprich auf ${APP_CONFIG.targetLanguage}…`
                : `Schreibe auf ${APP_CONFIG.targetLanguage}…`
            }
            rows={1}
            className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-none leading-snug"
            style={{ minHeight: 40 }}
          />
        </div>

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSend}
          disabled={!canSend}
          className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            canSend
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 hover:bg-indigo-600'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600'
          }`}
        >
          <Send size={16} />
        </motion.button>
      </div>

      {/* Recording hint */}
      {isRecording && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-red-500 dark:text-red-400 mt-1"
        >
          Aufnahme läuft… Tippe auf Stop wenn fertig
        </motion.p>
      )}

      {/* Language hint */}
      {!isRecording && (
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-600 mt-1">
          Enter = Senden · Shift+Enter = Neue Zeile
        </p>
      )}
    </div>
  )
}
