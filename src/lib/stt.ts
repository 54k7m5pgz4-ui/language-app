/* eslint-disable @typescript-eslint/no-explicit-any */

type Rec = any
let rec: Rec = null

export const sttSupported = (): boolean =>
  'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

export function startListening(
  lang: string,
  onResult: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (err: string) => void,
): void {
  if (!sttSupported()) { onError('Spracherkennung nicht unterstützt'); return }
  stopListening()

  const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
  rec = new SR()
  rec.lang = lang
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1

  rec.onresult = (e: any) => {
    const r = e.results[e.results.length - 1]
    onResult(r[0].transcript, r.isFinal)
  }
  rec.onerror = (e: any) => { onError(e.error); rec = null }
  rec.onend = () => { rec = null; onEnd() }
  rec.start()
}

export function stopListening(): void {
  rec?.stop()
  rec = null
}

export function isListening(): boolean {
  return rec !== null
}
