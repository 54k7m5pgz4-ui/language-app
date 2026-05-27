export const APP_CONFIG = {
  targetLanguage: 'Deutsch',
  targetLanguageCode: 'de' as const,
  nativeLanguage: 'Englisch',
  level: 'A1' as const,
  goal: 'Alltag' as const,
  intensity: 'Normal' as const,
  claudeModel: 'claude-haiku-4-5-20251001',
} as const

export const INTENSITY_GOALS = {
  Locker: 20,
  Normal: 50,
  Intensiv: 100,
} as const

export const DAILY_GOAL_XP = INTENSITY_GOALS[APP_CONFIG.intensity]
export const XP_PER_LEVEL = 500

export const COURSE_TOPICS = [
  { id: 'anfaenger', label: 'Anfänger', emoji: '🌱' },
  { id: 'grundlagen', label: 'Grundlagen', emoji: '📖' },
  { id: 'alltag', label: 'Alltag', emoji: '🏠' },
  { id: 'reisen', label: 'Reisen', emoji: '✈️' },
  { id: 'essen', label: 'Essen', emoji: '🍽️' },
  { id: 'arbeit', label: 'Arbeit', emoji: '💼' },
  { id: 'freunde', label: 'Freunde', emoji: '👫' },
  { id: 'familie', label: 'Familie', emoji: '👨‍👩‍👧' },
  { id: 'sport', label: 'Sport', emoji: '⚽' },
  { id: 'gesundheit', label: 'Gesundheit', emoji: '🏥' },
  { id: 'einkaufen', label: 'Einkaufen', emoji: '🛍️' },
  { id: 'termine', label: 'Termine', emoji: '📅' },
  { id: 'technik', label: 'Technik', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '📊' },
  { id: 'studium', label: 'Studium', emoji: '🎓' },
  { id: 'emotionen', label: 'Emotionen', emoji: '❤️' },
  { id: 'medien', label: 'Medien', emoji: '📺' },
  { id: 'kultur', label: 'Kultur', emoji: '🎭' },
  { id: 'fortgeschritten', label: 'Fortgeschritten', emoji: '🚀' },
] as const

export const VOCAB_DECKS = [
  { id: 'begruessungen', label: 'Begrüßungen', emoji: '👋', count: 20 },
  { id: 'zahlen', label: 'Zahlen', emoji: '🔢', count: 30 },
  { id: 'essen', label: 'Essen', emoji: '🍕', count: 40 },
  { id: 'reisen', label: 'Reisen', emoji: '🧳', count: 35 },
  { id: 'arbeit', label: 'Arbeit', emoji: '💼', count: 45 },
  { id: 'sport', label: 'Sport', emoji: '🏃', count: 25 },
  { id: 'alltag', label: 'Alltag', emoji: '🏠', count: 50 },
  { id: 'familie', label: 'Familie', emoji: '👨‍👩‍👧', count: 20 },
  { id: 'gefuehle', label: 'Gefühle', emoji: '😊', count: 30 },
  { id: 'business', label: 'Business', emoji: '📊', count: 40 },
  { id: 'schule', label: 'Schule', emoji: '📚', count: 35 },
  { id: 'technik', label: 'Technik', emoji: '💻', count: 30 },
] as const

export const SCENARIOS = [
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'flughafen', label: 'Flughafen', emoji: '✈️' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'arbeit', label: 'Arbeit', emoji: '💼' },
  { id: 'bewerbung', label: 'Bewerbungsgespräch', emoji: '🤝' },
  { id: 'smalltalk', label: 'Smalltalk', emoji: '💬' },
  { id: 'fitnessstudio', label: 'Fitnessstudio', emoji: '💪' },
  { id: 'arzt', label: 'Arzt', emoji: '🏥' },
  { id: 'einkaufen', label: 'Einkaufen', emoji: '🛒' },
  { id: 'freunde', label: 'Freunde treffen', emoji: '👫' },
  { id: 'dating', label: 'Dating', emoji: '💝' },
  { id: 'reisen', label: 'Reisen', emoji: '🧳' },
  { id: 'uni', label: 'Uni / Schule', emoji: '🎓' },
  { id: 'meeting', label: 'Business Meeting', emoji: '📊' },
  { id: 'telefonat', label: 'Telefonat', emoji: '📞' },
  { id: 'alltag', label: 'Alltagssituationen', emoji: '🏠' },
  { id: 'sport', label: 'Sport', emoji: '⚽' },
  { id: 'familie', label: 'Familie', emoji: '👨‍👩‍👧' },
  { id: 'notfall', label: 'Notfälle', emoji: '🚨' },
] as const
