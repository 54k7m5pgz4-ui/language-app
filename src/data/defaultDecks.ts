export interface RawCard {
  word: string
  translation: string
  pronunciation: string
  example: string
}

export const DEFAULT_DECK_DATA: Record<string, RawCard[]> = {
  begruessungen: [
    { word: 'Hallo', translation: 'Hello', pronunciation: 'ha-lo', example: 'Hallo! Wie geht es dir?' },
    { word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'goo-ten mor-gen', example: 'Guten Morgen! Hast du gut geschlafen?' },
    { word: 'Guten Tag', translation: 'Good day / Good afternoon', pronunciation: 'goo-ten tahk', example: 'Guten Tag, kann ich Ihnen helfen?' },
    { word: 'Guten Abend', translation: 'Good evening', pronunciation: 'goo-ten ah-bent', example: 'Guten Abend! Schön, Sie zu sehen.' },
    { word: 'Auf Wiedersehen', translation: 'Goodbye (formal)', pronunciation: 'owf vee-der-zay-en', example: 'Auf Wiedersehen! Bis nächste Woche.' },
    { word: 'Tschüss', translation: 'Bye / Ciao (informal)', pronunciation: 'choos', example: 'Tschüss! Bis morgen!' },
    { word: 'Danke schön', translation: 'Thank you very much', pronunciation: 'dank-eh shern', example: 'Danke schön für Ihre Hilfe!' },
    { word: 'Bitte', translation: 'Please / You\'re welcome', pronunciation: 'bit-eh', example: 'Können Sie mir bitte helfen?' },
    { word: 'Entschuldigung', translation: 'Excuse me / Sorry', pronunciation: 'ent-shool-di-goong', example: 'Entschuldigung, wo ist der Bahnhof?' },
    { word: 'Wie geht es Ihnen?', translation: 'How are you? (formal)', pronunciation: 'vee gayt es ee-nen', example: 'Guten Tag! Wie geht es Ihnen?' },
  ],

  zahlen: [
    { word: 'eins', translation: 'one', pronunciation: 'ines', example: 'Ich möchte ein Bier, bitte.' },
    { word: 'zwei', translation: 'two', pronunciation: 'tsvye', example: 'Ich habe zwei Kinder.' },
    { word: 'drei', translation: 'three', pronunciation: 'dry', example: 'Wir sind drei Personen.' },
    { word: 'vier', translation: 'four', pronunciation: 'feer', example: 'Das kostet vier Euro.' },
    { word: 'fünf', translation: 'five', pronunciation: 'fuenf', example: 'Der Zug fährt um fünf Uhr ab.' },
    { word: 'sechs', translation: 'six', pronunciation: 'zecks', example: 'Sie hat sechs Geschwister.' },
    { word: 'sieben', translation: 'seven', pronunciation: 'zee-ben', example: 'Die Woche hat sieben Tage.' },
    { word: 'acht', translation: 'eight', pronunciation: 'akht', example: 'Ich arbeite acht Stunden am Tag.' },
    { word: 'neun', translation: 'nine', pronunciation: 'noyn', example: 'Das Meeting beginnt um neun Uhr.' },
    { word: 'zehn', translation: 'ten', pronunciation: 'tsayn', example: 'Ich warte seit zehn Minuten.' },
    { word: 'zwanzig', translation: 'twenty', pronunciation: 'tsvan-tsig', example: 'Sie ist zwanzig Jahre alt.' },
    { word: 'hundert', translation: 'one hundred', pronunciation: 'hoon-dert', example: 'Das kostet hundert Euro.' },
  ],

  essen: [
    { word: 'das Brot', translation: 'bread', pronunciation: 'das broht', example: 'Ich esse morgens immer Brot.' },
    { word: 'die Butter', translation: 'butter', pronunciation: 'dee boo-ter', example: 'Kannst du mir die Butter reichen?' },
    { word: 'das Fleisch', translation: 'meat', pronunciation: 'das flysh', example: 'Ich esse kein Fleisch – ich bin Vegetarier.' },
    { word: 'das Gemüse', translation: 'vegetables', pronunciation: 'das ge-mue-ze', example: 'Frisches Gemüse ist sehr gesund.' },
    { word: 'das Obst', translation: 'fruit', pronunciation: 'das opst', example: 'Ich kaufe jeden Tag frisches Obst.' },
    { word: 'die Milch', translation: 'milk', pronunciation: 'dee milkh', example: 'Nimmst du Milch in deinen Kaffee?' },
    { word: 'der Käse', translation: 'cheese', pronunciation: 'der kay-ze', example: 'Deutschland ist bekannt für guten Käse.' },
    { word: 'das Ei', translation: 'egg', pronunciation: 'das eye', example: 'Ich möchte zwei Spiegeleier, bitte.' },
    { word: 'der Kaffee', translation: 'coffee', pronunciation: 'der kaf-fay', example: 'Ich brauche morgens immer einen Kaffee.' },
    { word: 'das Wasser', translation: 'water', pronunciation: 'das vas-ser', example: 'Kann ich ein Glas Wasser haben?' },
  ],

  reisen: [
    { word: 'der Bahnhof', translation: 'train station', pronunciation: 'der bahn-hof', example: 'Wo ist der nächste Bahnhof?' },
    { word: 'der Flughafen', translation: 'airport', pronunciation: 'der flook-hah-fen', example: 'Der Flug geht vom Flughafen München ab.' },
    { word: 'das Hotel', translation: 'hotel', pronunciation: 'das ho-tel', example: 'Ich habe ein Zimmer im Hotel reserviert.' },
    { word: 'links', translation: 'left', pronunciation: 'links', example: 'Biegen Sie an der Ampel links ab.' },
    { word: 'rechts', translation: 'right', pronunciation: 'rekhts', example: 'Das Hotel ist rechts von der Kirche.' },
    { word: 'geradeaus', translation: 'straight ahead', pronunciation: 'ge-rah-de-ows', example: 'Gehen Sie geradeaus bis zur Kreuzung.' },
    { word: 'das Ticket', translation: 'ticket', pronunciation: 'das tik-et', example: 'Ich habe mein Ticket schon online gekauft.' },
    { word: 'der Koffer', translation: 'suitcase', pronunciation: 'der kof-fer', example: 'Mein Koffer ist zu schwer!' },
    { word: 'die Reise', translation: 'trip / journey', pronunciation: 'dee rye-ze', example: 'Gute Reise! Viel Spaß im Urlaub.' },
    { word: 'der Pass', translation: 'passport', pronunciation: 'der pas', example: 'Vergiss nicht deinen Pass einzupacken!' },
  ],

  arbeit: [
    { word: 'die Arbeit', translation: 'work / job', pronunciation: 'dee ar-bite', example: 'Wie ist deine Arbeit?' },
    { word: 'das Büro', translation: 'office', pronunciation: 'das bue-roh', example: 'Ich arbeite von Zuhause, nicht im Büro.' },
    { word: 'der Kollege', translation: 'colleague (male)', pronunciation: 'der kol-lay-ge', example: 'Mein Kollege ist sehr nett.' },
    { word: 'das Meeting', translation: 'meeting', pronunciation: 'das mee-ting', example: 'Das Meeting beginnt um 10 Uhr.' },
    { word: 'das Gehalt', translation: 'salary', pronunciation: 'das ge-halt', example: 'Ich möchte über mein Gehalt verhandeln.' },
    { word: 'der Urlaub', translation: 'vacation / holiday', pronunciation: 'der oor-lowp', example: 'Ich nehme nächsten Monat Urlaub.' },
    { word: 'der Termin', translation: 'appointment', pronunciation: 'der ter-meen', example: 'Ich habe morgen einen wichtigen Termin.' },
    { word: 'kündigen', translation: 'to quit / resign', pronunciation: 'kuen-di-gen', example: 'Sie hat ihren Job gekündigt.' },
    { word: 'die Bewerbung', translation: 'job application', pronunciation: 'dee be-ver-boong', example: 'Ich habe meine Bewerbung abgeschickt.' },
    { word: 'die Präsentation', translation: 'presentation', pronunciation: 'dee pray-zen-ta-tsee-ohn', example: 'Meine Präsentation dauert 20 Minuten.' },
  ],

  sport: [
    { word: 'der Fußball', translation: 'football / soccer', pronunciation: 'der foos-bal', example: 'Deutschland liebt Fußball.' },
    { word: 'schwimmen', translation: 'to swim', pronunciation: 'shvim-men', example: 'Ich schwimme jeden Morgen eine Stunde.' },
    { word: 'laufen', translation: 'to run', pronunciation: 'low-fen', example: 'Ich laufe dreimal die Woche.' },
    { word: 'das Fitnessstudio', translation: 'gym', pronunciation: 'das fit-nes-shtoo-dee-oh', example: 'Ich gehe jeden Tag ins Fitnessstudio.' },
    { word: 'gewinnen', translation: 'to win', pronunciation: 'ge-vin-nen', example: 'Deutschland hat das Spiel gewonnen!' },
    { word: 'verlieren', translation: 'to lose', pronunciation: 'fer-lee-ren', example: 'Wir haben leider verloren.' },
    { word: 'trainieren', translation: 'to train / practice', pronunciation: 'trai-nee-ren', example: 'Er trainiert jeden Tag zwei Stunden.' },
    { word: 'der Sportverein', translation: 'sports club', pronunciation: 'der shport-fer-ine', example: 'Ich bin Mitglied in einem Sportverein.' },
  ],

  alltag: [
    { word: 'das Haus', translation: 'house', pronunciation: 'das hows', example: 'Wir haben ein großes Haus.' },
    { word: 'die Wohnung', translation: 'apartment / flat', pronunciation: 'dee voh-noong', example: 'Ich suche eine neue Wohnung.' },
    { word: 'die Küche', translation: 'kitchen', pronunciation: 'dee kue-khe', example: 'Die Küche ist sehr modern.' },
    { word: 'aufwachen', translation: 'to wake up', pronunciation: 'owf-va-khen', example: 'Ich wache jeden Morgen um 7 Uhr auf.' },
    { word: 'kochen', translation: 'to cook', pronunciation: 'ko-khen', example: 'Ich koche gerne für meine Familie.' },
    { word: 'einkaufen', translation: 'to go shopping', pronunciation: 'ine-kow-fen', example: 'Ich muss heute noch einkaufen gehen.' },
    { word: 'putzen', translation: 'to clean', pronunciation: 'poo-tsen', example: 'Ich putze die Wohnung am Wochenende.' },
    { word: 'der Supermarkt', translation: 'supermarket', pronunciation: 'der zoo-per-markt', example: 'Der Supermarkt ist gleich um die Ecke.' },
    { word: 'die Apotheke', translation: 'pharmacy', pronunciation: 'dee a-po-tay-ke', example: 'Ich brauche ein Medikament aus der Apotheke.' },
    { word: 'der Schlüssel', translation: 'key', pronunciation: 'der shlues-sel', example: 'Ich habe meinen Schlüssel verloren!' },
  ],

  familie: [
    { word: 'die Mutter', translation: 'mother', pronunciation: 'dee moo-ter', example: 'Meine Mutter kocht sehr gut.' },
    { word: 'der Vater', translation: 'father', pronunciation: 'der fah-ter', example: 'Mein Vater ist Arzt.' },
    { word: 'die Schwester', translation: 'sister', pronunciation: 'dee shves-ter', example: 'Ich habe eine ältere Schwester.' },
    { word: 'der Bruder', translation: 'brother', pronunciation: 'der broo-der', example: 'Mein Bruder wohnt in Berlin.' },
    { word: 'die Großmutter', translation: 'grandmother', pronunciation: 'dee grohs-moo-ter', example: 'Meine Großmutter ist 80 Jahre alt.' },
    { word: 'der Großvater', translation: 'grandfather', pronunciation: 'der grohs-fah-ter', example: 'Mein Großvater erzählt tolle Geschichten.' },
    { word: 'das Kind', translation: 'child', pronunciation: 'das kint', example: 'Wir haben zwei Kinder.' },
    { word: 'der Ehemann', translation: 'husband', pronunciation: 'der ay-e-man', example: 'Mein Ehemann kommt aus München.' },
  ],

  gefuehle: [
    { word: 'glücklich', translation: 'happy', pronunciation: 'gluek-likh', example: 'Ich bin so glücklich heute!' },
    { word: 'traurig', translation: 'sad', pronunciation: 'trow-rikh', example: 'Warum bist du so traurig?' },
    { word: 'wütend', translation: 'angry', pronunciation: 'vue-tent', example: 'Er ist sehr wütend auf mich.' },
    { word: 'müde', translation: 'tired', pronunciation: 'mue-de', example: 'Ich bin so müde – ich habe schlecht geschlafen.' },
    { word: 'aufgeregt', translation: 'excited', pronunciation: 'owf-ge-rekt', example: 'Ich bin aufgeregt wegen des Konzerts!' },
    { word: 'ängstlich', translation: 'anxious / scared', pronunciation: 'engst-likh', example: 'Sie ist ängstlich vor der Prüfung.' },
    { word: 'verliebt', translation: 'in love', pronunciation: 'fer-leept', example: 'Er ist total verliebt in sie.' },
    { word: 'überrascht', translation: 'surprised', pronunciation: 'ue-ber-rasht', example: 'Ich bin sehr überrascht!' },
  ],

  business: [
    { word: 'die Konferenz', translation: 'conference', pronunciation: 'dee kon-fe-rents', example: 'Die Konferenz findet in Hamburg statt.' },
    { word: 'der Vertrag', translation: 'contract', pronunciation: 'der fer-trahk', example: 'Wir haben den Vertrag unterschrieben.' },
    { word: 'verhandeln', translation: 'to negotiate', pronunciation: 'fer-han-deln', example: 'Wir müssen über den Preis verhandeln.' },
    { word: 'der Kunde', translation: 'client / customer', pronunciation: 'der koon-de', example: 'Der Kunde ist mit dem Service zufrieden.' },
    { word: 'das Budget', translation: 'budget', pronunciation: 'das bood-zshet', example: 'Unser Budget für das Projekt ist begrenzt.' },
    { word: 'der Umsatz', translation: 'revenue / turnover', pronunciation: 'der oom-zats', example: 'Der Umsatz ist dieses Jahr gestiegen.' },
    { word: 'die Strategie', translation: 'strategy', pronunciation: 'dee shtrah-te-gee', example: 'Wir brauchen eine neue Marketingstrategie.' },
    { word: 'das Netzwerk', translation: 'network', pronunciation: 'das nets-verk', example: 'Ein gutes Netzwerk ist im Business wichtig.' },
  ],

  schule: [
    { word: 'die Schule', translation: 'school', pronunciation: 'dee shoo-le', example: 'Ich gehe gerne in die Schule.' },
    { word: 'die Universität', translation: 'university', pronunciation: 'dee oo-ni-ver-zi-tait', example: 'Sie studiert an der Universität Berlin.' },
    { word: 'lernen', translation: 'to learn / to study', pronunciation: 'ler-nen', example: 'Ich lerne jeden Tag Deutsch.' },
    { word: 'die Note', translation: 'grade / mark', pronunciation: 'dee no-te', example: 'Sie hat eine sehr gute Note bekommen.' },
    { word: 'die Prüfung', translation: 'exam / test', pronunciation: 'dee prue-foong', example: 'Ich habe morgen eine wichtige Prüfung.' },
    { word: 'das Lehrbuch', translation: 'textbook', pronunciation: 'das layr-bookh', example: 'Das Lehrbuch ist sehr teuer.' },
    { word: 'der Stift', translation: 'pen / pencil', pronunciation: 'der shtift', example: 'Kannst du mir deinen Stift leihen?' },
    { word: 'hausaufgaben', translation: 'homework', pronunciation: 'hows-owf-gah-ben', example: 'Hast du deine Hausaufgaben gemacht?' },
  ],

  technik: [
    { word: 'das Smartphone', translation: 'smartphone', pronunciation: 'das smart-fohn', example: 'Mein Smartphone ist kaputt.' },
    { word: 'herunterladen', translation: 'to download', pronunciation: 'he-roon-ter-lah-den', example: 'Ich lade die App gerade herunter.' },
    { word: 'hochladen', translation: 'to upload', pronunciation: 'hohkh-lah-den', example: 'Ich lade das Foto auf Instagram hoch.' },
    { word: 'das Passwort', translation: 'password', pronunciation: 'das pas-vort', example: 'Ich habe mein Passwort vergessen.' },
    { word: 'die Batterie', translation: 'battery', pronunciation: 'dee ba-te-ree', example: 'Meine Batterie ist fast leer.' },
    { word: 'der Bildschirm', translation: 'screen / display', pronunciation: 'der bilt-shirm', example: 'Der Bildschirm ist kaputt.' },
    { word: 'die Verbindung', translation: 'connection', pronunciation: 'dee fer-bin-doong', example: 'Die Internetverbindung ist sehr langsam.' },
    { word: 'aktualisieren', translation: 'to update', pronunciation: 'ak-too-a-li-zee-ren', example: 'Du solltest dein System aktualisieren.' },
  ],
}
