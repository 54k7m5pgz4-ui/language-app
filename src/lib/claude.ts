import Anthropic from '@anthropic-ai/sdk'
import { APP_CONFIG } from '../config/appConfig'

export interface ParsedTutorResponse {
  main: string
  translation: string
  grammar: string
  correction: string
  alternatives: string[]
}

export function hasApiKey(): boolean {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY)
}

function getClient(): Anthropic {
  return new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
    dangerouslyAllowBrowser: true,
  })
}

function buildSystemPrompt(scenario?: string): string {
  return `Du bist ein freundlicher, geduldiger und motivierender Sprachlehrer, der ${APP_CONFIG.targetLanguage} an deutschsprachige Lernende auf Niveau ${APP_CONFIG.level} unterrichtest.

Lernziel: ${APP_CONFIG.goal}
${scenario ? `Gesprächssituation: ${scenario}` : 'Freies Gespräch'}

Regeln:
- Antworte auf ${APP_CONFIG.targetLanguage}, angepasst an Niveau ${APP_CONFIG.level}
- Kurze, natürliche, gesprächsorientierte Antworten (2-4 Sätze)
- Freundlich, ermutigend, geduldig
- Korrekturen sanft und konstruktiv

Verwende EXAKT dieses Format (die Trennzeichen müssen auf eigener Zeile stehen):

[Deine Antwort auf ${APP_CONFIG.targetLanguage}]

---ÜBERSETZUNG---
[Deutsche Übersetzung]

---GRAMMATIK---
[Kurzer Grammatik-Hinweis auf Deutsch, oder leer lassen]

---KORREKTUR---
[Fehlerkorrektur der Lernenden-Nachricht auf Deutsch, oder "Kein Fehler ✓"]

---ALTERNATIVEN---
[2-3 alternative Formulierungen in ${APP_CONFIG.targetLanguage}, kommagetrennt, oder leer lassen]`
}

function extractMain(text: string): string {
  const idx = text.indexOf('\n---')
  return idx === -1 ? text.trim() : text.slice(0, idx).trim()
}

function parseResponse(raw: string): ParsedTutorResponse {
  const buf: Record<string, string[]> = { main: [] }
  let cur = 'main'

  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (t === '---ÜBERSETZUNG---') { cur = 'translation'; buf.translation = []; continue }
    if (t === '---GRAMMATIK---') { cur = 'grammar'; buf.grammar = []; continue }
    if (t === '---KORREKTUR---') { cur = 'correction'; buf.correction = []; continue }
    if (t === '---ALTERNATIVEN---') { cur = 'alternatives'; buf.alternatives = []; continue }
    if (!buf[cur]) buf[cur] = []
    buf[cur].push(line)
  }

  const j = (k: string) => (buf[k] ?? []).join('\n').trim()
  const altRaw = j('alternatives')

  return {
    main: j('main'),
    translation: j('translation'),
    grammar: j('grammar'),
    correction: j('correction'),
    alternatives: altRaw
      ? altRaw.split(',').map(s => s.trim()).filter(Boolean)
      : [],
  }
}

export async function streamTutorMessage(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  scenario?: string
  onDelta: (mainText: string) => void
  onComplete: (parsed: ParsedTutorResponse) => void
  onError: (err: Error) => void
}): Promise<void> {
  const client = getClient()
  let fullText = ''

  try {
    const stream = client.messages.stream({
      model: APP_CONFIG.claudeModel,
      max_tokens: 1024,
      system: buildSystemPrompt(params.scenario),
      messages: params.messages,
    })

    stream.on('text', (text: string) => {
      fullText += text
      params.onDelta(extractMain(fullText))
    })

    await stream.finalMessage()
    params.onComplete(parseResponse(fullText))
  } catch (err) {
    params.onError(err instanceof Error ? err : new Error(String(err)))
  }
}

export async function generateVocabDeck(topic: string): Promise<Array<{
  word: string; translation: string; pronunciation: string; example: string
}>> {
  const client = getClient()
  const res = await client.messages.create({
    model: APP_CONFIG.claudeModel,
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Erstelle 15 Vokabelkarten zum Thema "${topic}" in ${APP_CONFIG.targetLanguage} für deutschsprachige Lernende (Niveau ${APP_CONFIG.level}).

Antworte NUR mit einem JSON-Array (kein Markdown, kein Text darum):
[{"word":"...","translation":"...","pronunciation":"...","example":"..."}]

word = ${APP_CONFIG.targetLanguage}, translation = Deutsch, pronunciation = IPA/vereinfacht, example = kurzer Satz`,
    }],
  })
  const text = res.content[0].type === 'text' ? res.content[0].text : ''
  const m = text.match(/\[[\s\S]*\]/)
  if (!m) throw new Error('Ungültige KI-Antwort')
  return JSON.parse(m[0])
}
