import { Dictionary } from './en';

export const DE: Dictionary = {
  countries: {
    TITLE: 'Länder',
    ENTITY: 'Land',
    code: 'Flagge',
    name: 'Name',
    isoCode: 'ISO',
    dialingCode: 'Vorwahl',
    capital: 'Hauptstadt'
  },
  cities: {
    TITLE: 'Städte',
    ENTITY: 'Stadt',
    flag: 'Flagge',
    code: 'Code',
    name: 'Name',
    nameAr: 'Name (AR)',
    isCapital: 'Hauptstadt',
    population: 'Einwohner',
    populationFormatted: 'Einwohner'
  },
  TABS: { ALL: 'Alle Städte', TOP: 'Größte' },
  SEARCH: 'Suchen',
  FILTER: 'Filtern',
  FILTERS: 'Filter',
  CLEAR: 'Zurücksetzen',
  ADD: 'Hinzufügen',
  CLOSE: 'Schließen',
  SAVE: 'Speichern',
  NO_OPTIONS: 'Keine Optionen',
  NO_RESULTS_FOUND: 'Keine Ergebnisse gefunden',
  details: 'Details',
  edit: 'Bearbeiten',
  Delete: 'Löschen',
  Cancel: 'Abbrechen',
  DETECT_CHANGES: 'Nicht gespeicherte Änderungen',
  ASK_SAVE_CHANGES: 'Möchten Sie Ihre Änderungen speichern?',
  CONFIRMATION_SAVE: 'Speichern',
  CONFIRMATION_SAVE_CANCEL: 'Verwerfen',
  UNCOMPLETED_FORM: 'Unvollständiges Formular',
  FILL_MISSING_FIELDS: 'Bitte füllen Sie die Pflichtfelder aus.',
  PAGINATOR: {
    ITEMS_PER_PAGE: 'Einträge pro Seite:',
    NEXT_PAGE: 'Nächste Seite',
    PREVIOUS_PAGE: 'Vorherige Seite',
    FIRST_PAGE: 'Erste Seite',
    LAST_PAGE: 'Letzte Seite',
    RANGE: '{{start}} – {{end}} von {{length}}'
  },

  app: {
    SKIP: 'Zum Inhalt springen',
    PAGES: 'Demoseiten',
    THEME: 'Design',
    LANGUAGE: 'Sprache',
    CHOOSE_LANGUAGE: 'Sprache wählen',
    GITHUB: 'GitHub',
    NPM: 'npm',
    FOOTER_LICENSE: 'Open Source unter der MIT-Lizenz.',
    FOOTER_CONTRIBUTE: 'Beiträge sind willkommen.',
    FOOTER_DATA: 'Demodaten: GeoNames (CC BY 4.0) und Wikipedia (CC BY-SA 4.0).'
  },
  nav: { overview: 'Übersicht', countries: 'Länder und Städte', tabs: 'Untergeordnete Tabs', cities: 'Städte', builder: 'Seiten-Builder' },
  continents: {
    ARIA: 'Nach Kontinent stöbern',
    all: 'Alle',
    africa: 'Afrika',
    asia: 'Asien',
    europe: 'Europa',
    northAmerica: 'Nordamerika',
    southAmerica: 'Südamerika',
    oceania: 'Ozeanien'
  },
  theme: { light: 'Hell', dark: 'Dunkel', ARIA: 'Design {{name}}' },
  units: {
    LABEL: 'Einwohner',
    auto: 'Auto',
    units: 'Einheiten',
    thousands: 'Tausend',
    millions: 'Millionen',
    auto_hint: 'K, M oder Mrd. je nach Wert',
    units_hint: 'Vollständige Zahl mit Tausendertrennzeichen',
    thousands_hint: 'Immer in K',
    millions_hint: 'Immer in M'
  },
  code: {
    SHOW: 'Code dieser Seite anzeigen',
    HIDE: 'Code dieser Seite ausblenden',
    FILES: '{{count}} Dateien',
    LINES: '{{count}} Zeilen',
    COPY: 'Kopieren',
    COPIED: 'Kopiert',
    COPY_FILE: 'Diese Datei kopieren',
    SOURCE_FILES: 'Quelldateien',
    config: 'Spalten, Felder, Tabellenkonfiguration',
    html: 'Template',
    ts: 'Komponente',
    scss: 'Stile'
  },
  pages: {
    countries: {
      title: 'Länder und ihre Städte',
      subtitle: 'Alle Länder der Welt, Algerien zuerst. Klicken Sie auf die Schaltfläche zum Aufklappen einer Zeile: Die untergeordnete Tabelle lädt bei Bedarf die Städte dieses Landes.'
    },
    tabs: {
      title: 'Untergeordnete Tabellen in Tabs',
      subtitle: 'Übergeben Sie ein Array an childConfig und jede Konfiguration wird zu einem Tab. Klappen Sie ein Land auf: Der erste Tab listet alle Städte (bearbeitbar), der zweite die zehn größten (schreibgeschützt).'
    },
    cities: {
      title: 'Städte eines beliebigen Landes',
      subtitle: 'Wählen Sie ein Land und seine Städte werden bei Bedarf geladen. Eine Tabelle, ein Konfigurationsobjekt: typisierte Spalten, Kopffilter (auch für die Einwohnerzahl), Statussymbole, Seitenumbruch und ein vollständiger Dialog zum Hinzufügen, Bearbeiten, Anzeigen und Löschen.',
      COUNTRY: 'Land',
      STAT_CITIES: 'Aufgeführte Städte',
      STAT_TOTAL: 'Gesamteinwohnerzahl',
      STAT_TOTAL_HINT: 'Summe der Einwohnerzahlen der unten aufgeführten Städte'
    },
    CITIES_OF: 'Städte: {{name}}',
    LARGEST_OF: 'Größte Städte: {{name}}'
  },
  overview: {
    BADGE: 'Open Source · MIT-Lizenz',
    HERO_TITLE: 'Fast nichts zu programmieren.',
    HERO_LEAD: 'Easy Mat UI macht aus einem einfachen Konfigurationsobjekt eine vollständige Angular-Material-Datentabelle: Filter, Dialoge, untergeordnete Tabellen, Tabs, helle und dunkle Designs und fünf Sprachen. Stöbern Sie in den Beispielen: Jede Seite zeigt ihren eigenen Code.',
    CTA_NPM: 'Auf npm holen',
    CTA_GITHUB: 'Auf GitHub mit einem Stern markieren',
    INSTALL_COPY: 'Installationsbefehl kopieren',
    INSTALL_COPIED: 'Kopiert',
    EXPLORE: 'Demo erkunden',
    OPEN_TITLE: 'Frei und Open Source',
    OPEN_TEXT: 'Easy Mat UI ist Open Source unter der MIT-Lizenz. Jeder kann es nutzen, den Code lesen und mithelfen, es zu verbessern: einen Fehler melden, eine Funktion vorschlagen, einen Tippfehler korrigieren oder eine Sprache hinzufügen. Jeder Beitrag ist willkommen, von der Korrektur einer Zeile bis zur neuen Komponente.',
    OPEN_REPO: 'Quellcode ansehen',
    OPEN_ISSUES: 'Problem melden',
    OPEN_CONTRIBUTE: 'So können Sie mitmachen',
    FEATURES_TITLE: 'Was die Bibliothek Ihnen bietet',
    FEATURES_LEAD: 'Alles Folgende entsteht aus einem einzigen Konfigurationsobjekt. Öffnen Sie eine Demoseite, um es in Aktion zu sehen.',
    TRY: 'Ausprobieren',
    features: {
      table: { t: 'Typisierte Datentabelle', d: 'Spalten vieler Typen (Text, Symbol, Bild, Zahl, Datum ...) aus einer typisierten Konfiguration.' },
      filters: { t: 'Spaltenfilter', d: 'Text- und Mehrfachauswahl-Filter im Kopf plus globale Suche, kombinierbar mit UND / ODER.' },
      paging: { t: 'Sortierung und Seitenumbruch', d: 'Sortierbare Spaltenköpfe, einstellbare Seitengröße und fixierter Kopf, übersetzt über ngx-translate.' },
      child: { t: 'Untergeordnete Tabellen und Tabs', d: 'Aufklappbare Zeilen, die eine untergeordnete Tabelle öffnen, oder mehrere, je ein Tab, bei Bedarf geladen.' },
      dialog: { t: 'Erstellen, bearbeiten, anzeigen', d: 'Ein Formulardialog mit Validierung, Warnung bei ungespeicherten Änderungen und Löschbestätigung.' },
      multi: { t: 'Mehrfachauswahl', d: 'Eine wiederverwendbare Mehrfachauswahl mit Suche, Alle auswählen und Zurücksetzen.' },
      themes: { t: 'Helle und dunkle Designs', d: 'Umschalten zur Laufzeit mit EasyThemeService. Alles wird über CSS-Variablen gesteuert.' },
      i18n: { t: 'Mehrsprachig, auch von rechts nach links', d: 'Jede Beschriftung läuft über ngx-translate. Diese Demo spricht Englisch, Arabisch, Französisch, Deutsch und Luxemburgisch.' },
      a11y: { t: 'Responsiv und barrierefrei', d: 'Per Tastatur bedienbar, sichtbarer Fokus und keine WCAG-2-A/AA-Verstöße laut axe-core.' }
    },
    STEPS_ARIA: 'So funktioniert es',
    steps: {
      describe: { t: 'Beschreiben', d: 'Spalten, Dialogfelder, Filter, Aktionen und untergeordnete Tabellen stehen in einer Konfigurationsdatei.' },
      drop: { t: 'Einbinden', d: 'Eine Komponente im Template: <lib-easy-table [config]="config">.' },
      done: { t: 'Fertig', d: 'Suche, Sortierung, Seitenumbruch, Dialoge, aufklappbare Zeilen, Tabs, Designs und i18n übernimmt die Bibliothek.' }
    },
    IDEA_TITLE: 'Die ganze Idee in 12 Zeilen',
    COMPAT_TITLE: 'Angular-Kompatibilität',
    COMPAT_TEXT: 'Geprüft durch Bauen und Ausführen der gepackten Bibliothek in sauberen Anwendungen.',
    compat: {
      ANGULAR: 'Angular',
      STATUS: 'Status',
      DETAILS: 'Details',
      ok: 'Unterstützt',
      warn: 'Funktioniert, inoffiziell',
      no: 'Funktioniert nicht',
      note20: 'Peer-Bereich ^20.0.0.',
      note1921: 'Baut und läuft; Installation mit --legacy-peer-deps.',
      note18: 'Die Tabelle schlägt zur Laufzeit mit Material 18 fehl.',
      note1617: 'Der Build schlägt fehl (benötigt @let, Angular 18.1+).'
    },
    CONTRIBUTE_TITLE: 'Machen Sie mit',
    CONTRIBUTE_LEAD: 'Sie müssen kein Experte sein. Wählen Sie, was zu Ihnen passt.',
    ways: {
      bug: { t: 'Fehler melden', d: 'Etwas verhält sich falsch? Eröffnen Sie ein Issue mit den Schritten zur Reproduktion.' },
      idea: { t: 'Funktion vorschlagen', d: 'Sagen Sie uns, was die Bibliothek für Sie nützlicher machen würde.' },
      lang: { t: 'Sprache hinzufügen', d: 'Übersetzungen sind einfache TypeScript-Wörterbücher: eines kopieren und übersetzen.' },
      code: { t: 'Pull Request senden', d: 'Einen Fehler beheben, die Doku verbessern oder eine Funktion bauen. Tests und CI laufen bei jedem Pull Request.' }
    },
    FLOW_ARIA: 'In drei Schritten beitragen',
    flow: {
      fork: 'Das Repository forken und klonen',
      branch: 'Einen Branch anlegen, die Änderung machen, die Tests ausführen',
      pr: 'Einen Pull Request öffnen: Wir prüfen ihn gemeinsam'
    },
    STAR_PLEASE: 'Wenn Ihnen die Bibliothek hilft, hilft ein Stern auf GitHub anderen, sie zu finden.'
  },
  builder: {
    TITLE: 'Seiten-Builder',
    SUBTITLE: 'Wählen Sie die Komponenten, richten Sie sie ein und erhalten Sie Template, TypeScript und Modelle. Der Befehl kann die Dateien auch direkt in Ihr Projekt schreiben.',
    STEP_PAGE: 'Seite',
    STEP_COMPONENTS: 'Komponenten',
    STEP_SETTINGS: 'Einstellungen',
    PAGE_NAME: 'Name der Seite',
    PAGE_NAME_HINT: 'Kleinbuchstaben mit Bindestrichen. Ordner, Dateien und Selektor leiten sich davon ab.',
    TEXTS: 'Texte',
    TEXTS_KEYS: 'Übersetzungsschlüssel',
    TEXTS_PLAIN: 'Einfache Texte',
    TEXTS_HINT_KEYS: 'Der Code liest die Texte mit ngx-translate, und die Einträge für die englische Datei werden erzeugt.',
    TEXTS_HINT_PLAIN: 'Die Texte stehen im Code: Es ist keine Übersetzungsbibliothek nötig.',
    SELECT_ONE: 'Wählen Sie mindestens eine Komponente.',
    categories: {
      Page: 'Seite',
      Data: 'Daten',
      Navigation: 'Navigation',
      Content: 'Inhalt',
      Settings: 'Einstellungen'
    },
    components: {
      'page-header': { t: 'Seitenkopf', d: 'Symbol, Titel und Untertitel.' },
      stat: { t: 'Kennzahlen', d: 'Einige Zahlen mit Beschriftung und Tonalität.' },
      'chip-nav': {
        t: 'Kategorie-Schaltflächen',
        d: 'Symbol, Farbe und Anzahl zum Durchsuchen nach Kategorie.'
      },
      segmented: {
        t: 'Segmentierte Auswahl',
        d: 'Eine Wahl unter wenigen: eine Einstellung, eine Ansicht.'
      },
      'language-switch': { t: 'Sprachauswahl', d: 'Ein Menü oder Schaltflächen zur Sprachauswahl.' },
      'card-grid': { t: 'Kartenraster', d: 'Symbol, Titel und Beschreibung in einem responsiven Raster.' },
      table: {
        t: 'Datentabelle',
        d: 'Filter, Seitenumbruch, Hinzufügen / Bearbeiten / Löschen und eine untergeordnete Tabelle.'
      }
    },
    f: {
      title: 'Titel',
      subtitle: 'Untertitel',
      icon: 'Symbol',
      label: 'Beschriftung',
      value: 'Wert',
      color: 'Farbe',
      count: 'Anzahl',
      description: 'Beschreibung',
      tone: 'Tonalität',
      clickable: 'Anklickbar',
      name: 'Name',
      type: 'Typ'
    },
    ADD_ROW: 'Hinzufügen',
    REMOVE_ROW: 'Entfernen',
    tones: {
      neutral: 'Neutral',
      accent: 'Akzent',
      success: 'Erfolg',
      warning: 'Warnung',
      danger: 'Gefahr'
    },
    MODEL: 'Modell',
    MODEL_GENERIC: 'Generisches Modell (item1, item2, item3)',
    MODEL_OWN: 'Eigene Felder',
    FIELDS: 'Felder',
    CHILD: 'Untergeordnete Tabelle unter jeder Zeile',
    CAN_CREATE: 'Hinzufügen',
    CAN_UPDATE: 'Bearbeiten',
    CAN_DELETE: 'Löschen',
    FILTERS: 'Spaltenfilter',
    PAGE_SIZE: 'Zeilen pro Seite',
    types: { string: 'Text', number: 'Zahl', boolean: 'Ja / Nein', date: 'Datum' },
    LAYOUT: 'Darstellung',
    layouts: { menu: 'Menü', inline: 'Schaltflächen' },
    DISPLAY: 'Zeigt',
    displays: { 'flag-name': 'Flagge und Name', flag: 'Flagge', name: 'Name', code: 'Kürzel' },
    LANGUAGES: 'Sprachen',
    ICON_ONLY: 'Nur Symbole',
    SIZE: 'Größe',
    COLUMNS: 'Spalten',
    PREVIEW: 'Vorschau',
    PREVIEW_TABLE_NOTE: 'Die Tabelle wird mit Beispielzeilen gezeigt (die untergeordnete Tabelle nicht).',
    CODE: 'Erzeugter Code',
    TRANSLATIONS_TAB: 'Englische Einträge',
    TRANSLATIONS_HINT: 'Fügen Sie diese Einträge Ihrer englischen Übersetzungsdatei hinzu. Der Befehl erledigt das für Sie.',
    NOTES: 'Gut zu wissen',
    COMMAND: 'Oder die Dateien in Ihr Projekt schreiben',
    COMMAND_TEXT: 'Laden Sie die Beschreibung herunter und führen Sie den Befehl im Hauptordner Ihres Angular-Projekts aus.',
    DOWNLOAD: 'Beschreibung herunterladen',
    COPY_COMMAND: 'Befehl kopieren',
    ERROR: 'Diese Seite kann noch nicht erzeugt werden'
  }
};
