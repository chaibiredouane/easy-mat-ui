import { Dictionary } from './en';

export const LB: Dictionary = {
  countries: {
    TITLE: 'Länner',
    ENTITY: 'Land',
    code: 'Fändel',
    name: 'Numm',
    isoCode: 'ISO',
    dialingCode: 'Virwahl',
    capital: 'Haaptstad'
  },
  cities: {
    TITLE: 'Stied',
    ENTITY: 'Stad',
    flag: 'Fändel',
    code: 'Code',
    name: 'Numm',
    nameAr: 'Numm (AR)',
    isCapital: 'Haaptstad',
    population: 'Awunner',
    populationFormatted: 'Awunner (formatéiert)'
  },
  TABS: { ALL: 'All Stied', TOP: 'Gréisste' },
  SEARCH: 'Sichen',
  FILTER: 'Filteren',
  FILTERS: 'Filteren',
  CLEAR: 'Zrécksetzen',
  ADD: 'Derbäisetzen',
  CLOSE: 'Zoumaachen',
  SAVE: 'Späicheren',
  NO_OPTIONS: 'Keng Optiounen',
  NO_RESULTS_FOUND: 'Keng Resultater fonnt',
  details: 'Detailer',
  edit: 'Änneren',
  Delete: 'Läschen',
  Cancel: 'Ofbriechen',
  DETECT_CHANGES: 'Net gespäichert Ännerungen',
  ASK_SAVE_CHANGES: 'Wëllt Dir Är Ännerunge späicheren?',
  CONFIRMATION_SAVE: 'Späicheren',
  CONFIRMATION_SAVE_CANCEL: 'Verwerfen',
  UNCOMPLETED_FORM: 'Onvollstänneg Formulaire',
  FILL_MISSING_FIELDS: 'Fëllt w.e.g. déi néideg Felder aus.',
  PAGINATOR: {
    ITEMS_PER_PAGE: 'Elementer pro Säit:',
    NEXT_PAGE: 'Nächst Säit',
    PREVIOUS_PAGE: 'Virescht Säit',
    FIRST_PAGE: 'Éischt Säit',
    LAST_PAGE: 'Lescht Säit',
    RANGE: '{{start}} – {{end}} vun {{length}}'
  },

  app: {
    SKIP: 'Zum Inhalt sprangen',
    PAGES: 'Demosäiten',
    THEME: 'Design',
    LANGUAGE: 'Sprooch',
    CHOOSE_LANGUAGE: 'Sprooch wielen',
    GITHUB: 'GitHub',
    NPM: 'npm',
    FOOTER_LICENSE: 'Open Source ënner der MIT-Lizenz.',
    FOOTER_CONTRIBUTE: 'Bäiträg si wëllkomm.',
    FOOTER_DATA: 'Demodaten: GeoNames (CC BY 4.0) a Wikipedia (CC BY-SA 4.0).'
  },
  nav: { overview: 'Iwwersiicht', countries: 'Länner a Stied', tabs: 'Ënnergeuerdnet Tabs', cities: 'Stied' },
  theme: { light: 'Hell', dark: 'Däischter', system: 'System', ARIA: 'Design {{name}}' },
  units: {
    LABEL: 'Awunner',
    auto: 'Auto',
    units: 'Eenheeten',
    thousands: 'Dausend',
    millions: 'Millioune',
    auto_hint: 'K, M oder Mrd. jee no Wäert',
    units_hint: 'Ganz Zuel mat Dausendertrennzeechen',
    thousands_hint: 'Ëmmer a K',
    millions_hint: 'Ëmmer a M'
  },
  code: {
    SHOW: 'De Code vun dëser Säit weisen',
    HIDE: 'De Code vun dëser Säit verstoppen',
    FILES: '{{count}} Dateien',
    LINES: '{{count}} Zeilen',
    COPY: 'Kopéieren',
    COPIED: 'Kopéiert',
    COPY_FILE: 'Dës Datei kopéieren',
    SOURCE_FILES: 'Quelldateien',
    config: 'Kolonnen, Felder, Tabellekonfiguratioun',
    html: 'Template',
    ts: 'Komponent',
    scss: 'Stiler'
  },
  pages: {
    countries: {
      title: 'Länner an hir Stied',
      subtitle: 'All Länner vun der Welt, Algerien als Éischt. Klickt op den Knäppchen fir eng Zeil opzemaachen: D’ Ënnertabell lued bei Bedarf d’Stied vun deem Land.'
    },
    tabs: {
      title: 'Ënnertabellen an Tabs',
      subtitle: 'Gitt en Array un childConfig a jidd Konfiguratioun gëtt en Tab. Maacht e Land op: Deen éischten Tab lëscht all seng Stied (ännerbar), deen zweeten déi zéng gréissten (nëmme liesbar).'
    },
    cities: {
      title: 'Stied vun all Land',
      subtitle: 'Wielt e Land an seng Stied ginn bei Bedarf gelueden. Eng Tabell, een Konfiguratiounsobjet: typiséiert Kolonnen, Kopffilteren (och fir d’Awunnerzuel), Statusikonen, Säitenëmbroch an en komplette Dialog fir derbäizesetzen, z’änneren, unzeweisen a ze läschen.',
      COUNTRY: 'Land'
    },
    CITIES_OF: 'Stied: {{name}}',
    LARGEST_OF: 'Gréisst Stied: {{name}}'
  },
  overview: {
    BADGE: 'Open Source · MIT-Lizenz',
    HERO_TITLE: 'Bal näischt ze programméieren.',
    HERO_LEAD: 'Easy Mat UI mécht aus engem einfache Konfiguratiounsobjet eng komplett Angular-Material-Datentabell: Filteren, Dialogen, Ënnertabellen, Tabs, hell an däischter Designen a fënnef Sproochen. Kuckt d’Beispiller duerch: All Säit weist hire ganze Code.',
    CTA_NPM: 'Op npm kréien',
    CTA_GITHUB: 'Mat engem Stär op GitHub markéieren',
    INSTALL_COPY: 'Installatiounsbefehl kopéieren',
    INSTALL_COPIED: 'Kopéiert',
    EXPLORE: 'D’Demo entdecken',
    OPEN_TITLE: 'Fräi an Open Source',
    OPEN_TEXT: 'Easy Mat UI ass Open Source ënner der MIT-Lizenz. Jiddereen ka se notzen, de Code liesen an hëllefen, se besser ze maachen: e Feeler mellen, eng Funktioun virschloen, e Tippfeeler korrigéieren oder eng Sprooch derbäisetzen. All Bäitrag ass wëllkomm, vun enger Zeil bis zu enger neier Komponent.',
    OPEN_REPO: 'De Quellcode kucken',
    OPEN_ISSUES: 'E Problem mellen',
    OPEN_CONTRIBUTE: 'Esou kënnt Dir matmaachen',
    FEATURES_TITLE: 'Wat d’Bibliothéik Iech bitt',
    FEATURES_LEAD: 'Alles hei drënner kënnt aus engem eenzege Konfiguratiounsobjet. Mécht eng Demosäit op, fir et am Gang ze gesinn.',
    TRY: 'Ausprobéieren',
    features: {
      table: { t: 'Typiséiert Datentabell', d: 'Kolonne vu ville Typen (Text, Ikon, Bild, Zuel, Datum ...) aus enger typiséierter Konfiguratioun.' },
      filters: { t: 'Kolonnefilteren', d: 'Text- a Méifachauswielfilteren am Kapp, plus eng global Sich, kombinéierbar mat AN / ODER.' },
      paging: { t: 'Sortéieren a Säitenëmbroch', d: 'Sortéierbar Kapzeilen, anstellbar Säitegréisst a fixéierte Kapp, iwwersat iwwer ngx-translate.' },
      child: { t: 'Ënnertabellen an Tabs', d: 'Opmaachbar Zeilen, déi eng Ënnertabell opmaachen, oder méi, een Tab all, bei Bedarf gelueden.' },
      dialog: { t: 'Erstellen, änneren, kucken', d: 'E Formulairedialog mat Validatioun, Warnung bei net gespäicherten Ännerungen a Läschbestätegung.' },
      multi: { t: 'Méifachauswiel', d: 'Eng widderverwendbar Méifachauswiel mat Sich, Alles auswielen a Zrécksetzen.' },
      themes: { t: 'Hell an däischter Designen', d: 'Wiesselen zur Laufzäit mat EasyThemeService. Alles gëtt vun CSS-Variabele gesteiert.' },
      i18n: { t: 'Méisproocheg, och vu riets no lénks', d: 'All Beschrëftung geet iwwer ngx-translate. Dës Demo schwätzt Englesch, Arabesch, Franséisch, Däitsch a Lëtzebuergesch.' },
      a11y: { t: 'Responsiv a barrièrefräi', d: 'Mat der Tastatur bedéienbar, siichtbare Fokus a keng WCAG-2-A/AA-Verstéiss laut axe-core.' }
    },
    STEPS_ARIA: 'Esou funktionéiert et',
    steps: {
      describe: { t: 'Beschreiwen', d: 'Kolonnen, Dialogfelder, Filteren, Aktiounen an Ënnertabellen stinn an enger Konfiguratiounsdatei.' },
      drop: { t: 'Abannen', d: 'Eng Komponent am Template: <lib-easy-table [config]="config">.' },
      done: { t: 'Fäerdeg', d: 'Sich, Sortéieren, Säitenëmbroch, Dialogen, opmaachbar Zeilen, Tabs, Designen an i18n iwwerhëlt d’Bibliothéik.' }
    },
    IDEA_TITLE: 'D’ganz Iddi a 12 Zeilen',
    IDEA_TEXT: 'Installéieren, d’Tabell beschreiwen, eng Komponent an d’Template setzen.',
    COMPAT_TITLE: 'Angular-Kompatibilitéit',
    COMPAT_TEXT: 'Gepréift duerch Bauen an Ausféiere vun der gepacktter Bibliothéik a propperen Uwendungen.',
    compat: {
      ANGULAR: 'Angular',
      STATUS: 'Status',
      DETAILS: 'Detailer',
      ok: 'Ënnerstëtzt',
      warn: 'Funktionéiert, inoffiziell',
      no: 'Funktionéiert net',
      note20: 'Peer-Beräich ^20.0.0.',
      note1921: 'Baut a leeft; Installatioun mat --legacy-peer-deps.',
      note18: 'D’Tabell klappt zur Laufzäit mat Material 18 net.',
      note1617: 'De Build klappt net (brauch @let, Angular 18.1+).'
    },
    CONTRIBUTE_TITLE: 'Maacht mat',
    CONTRIBUTE_LEAD: 'Dir musst kee Expert sinn. Wielt, wat zu Iech passt.',
    ways: {
      bug: { t: 'E Feeler mellen', d: 'Eppes verhält sech falsch? Mécht en Issue op mat de Schrëtt fir et nozevollzéien.' },
      idea: { t: 'Eng Funktioun virschloen', d: 'Seet eis, wat d’Bibliothéik fir Iech nëtzlecher géif maachen.' },
      lang: { t: 'Eng Sprooch derbäisetzen', d: 'Iwwersetzunge si just einfach TypeScript-Dictionnairen: ee kopéieren an iwwersetzen.' },
      code: { t: 'E Pull Request schécken', d: 'E Feeler beheeben, d’Dokumentatioun verbesseren oder eng Funktioun bauen. Tester a CI lafen bei all Pull Request.' }
    },
    FLOW_ARIA: 'A dräi Schrëtt matmaachen',
    flow: {
      fork: 'D’Repository forken a klonen',
      branch: 'E Branch uleeën, d’Ännerung maachen, d’Tester lafe loossen',
      pr: 'E Pull Request opmaachen: mir kucken en zesumme duerch'
    },
    STAR_PLEASE: 'Wann d’Bibliothéik Iech hëlleft, hëlleft e Stär op GitHub anere Leit, se ze fannen.'
  }
};
