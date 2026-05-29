# Phase 9: KI- und Lernsystem-Erweiterung

## Ziele

- Verbesserter, professioneller Tutor-Placeholder ohne API-Key
- Adaptive Lernpfade und personalisierte Tagesziele
- Stärkere Spaced-Repetition-Unterstützung
- Mini-Tests und Fokus-Empfehlungen
- Fehlerhistorie und Lernstatistik-Erweiterung
- Vorbereitung auf Shadowing- und Aussprache-Training

## Änderungen

- `src/pages/AITutor/index.tsx`
  - Professioneller Platzhalter bei fehlendem `VITE_ANTHROPIC_API_KEY`
  - Verlinkung zurück zur Startseite und zum Vokabeltrainer

- `src/store/useProgressStore.ts`
  - Review-Historie gespeichert für Fehlerauswertung
  - `recordReview()` zur Erfassung von Review-Ergebnissen

- `src/store/useVocabStore.ts`
  - `getTopDueDecks()` zur Bestimmung des Fokus-Decks
  - Adaptive Empfehlung auf Basis fälliger Karten

- `src/pages/Dashboard/index.tsx`
  - Neues adaptives Lernpfad-Panel mit Empfehlungsbox
  - Shadowing- und Mini-Test-Action-Kacheln
  - Mehr Lernempfehlungen und Fokus-Decks

- `src/pages/Vocabulary/components/StudySession.tsx`
  - Review-Ergebnisse werden im Fortschritts-Store protokolliert

- `src/pages/Vocabulary/components/Stats.tsx`
  - Zusätzliche Statistik für Reviews und Fehler

## Stabilität

- Bestehende Supabase-Integration bleibt unverändert.
- Kein KI-Crash bei fehlendem Key.
- Lokaler Modus und Mobile-First-Design bleiben erhalten.
- Dark Mode bleibt erhalten.
