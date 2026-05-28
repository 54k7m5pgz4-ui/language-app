# Supabase RLS Hinweise und Setup-Hinweise

Diese Datei enthält empfohlene Row-Level-Security (RLS) Policies, Hinweise zur sicheren Konfiguration und Beispiele, die beim Deployment helfen.

## Grundprinzip

- Aktiviere RLS auf allen Tabellen, die benutzerspezifische Daten enthalten (z. B. `profiles`, `progress`, `vocab_cards`, `chat_history`).
- Policies sollten sicherstellen, dass `auth.uid()` mit `user_id` übereinstimmt.
- Teste Policies mit mehreren Test-Benutzern, um sicherzustellen, dass keine unerwünschten Zugriffe möglich sind.

## Beispiel-Policies

1) Vollständiger Zugriff für den Eigentümer (SELECT/INSERT/UPDATE/DELETE):

```sql
CREATE POLICY "Owners can manage their rows" ON public.progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

2) Lesender Zugriff für alle (nur für öffentliche Tabellen wie `lessons`):

```sql
CREATE POLICY "Public read" ON public.lessons
  FOR SELECT
  USING (true);
```

3) Erlauben, dass Authenticated Users eigene Reihen erstellen können:

```sql
CREATE POLICY "Insert own rows" ON public.vocab_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Hinweise zur Auth-Konfiguration

- Verwende die Supabase Auth-Provider (E-Mail/Passwort) für Benutzeridentifikation.
- Stelle sicher, dass `jwt`-Signatur und `anon`-Key sicher verwahrt werden (nicht im Repo).
- Teste die Policies mit dem Policy-Editor in der Supabase-Konsole.

## Sicherheitshinweise

- Committe niemals echte API-Keys in das Repository.
- Speichere `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` in deiner CI/CD-Secret-Store und in einer lokalen `.env` (die in `.gitignore` steht).
- Für lokale Entwicklung kannst du ein `.env.local` verwenden.

## Troubleshooting

- Fehler wie "permission denied" deuten häufig auf fehlende oder fehlerhafte Policies hin.
- Verwende Supabase Logs und Policy-Editor, um zu debuggen.


