export const ttsSupported = (): boolean => 'speechSynthesis' in window

export function speak(text: string, lang: string, slow = false): void {
  if (!ttsSupported() || !text.trim()) return
  stopSpeaking()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = slow ? 0.65 : 1.0
  u.pitch = 1.0
  u.volume = 1.0
  speechSynthesis.speak(u)
}

export function stopSpeaking(): void {
  speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking
}
