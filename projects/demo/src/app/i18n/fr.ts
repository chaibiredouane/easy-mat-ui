import { Dictionary } from './en';

export const FR: Dictionary = {
  countries: {
    TITLE: 'Pays',
    ENTITY: 'Pays',
    code: 'Drapeau',
    name: 'Nom',
    isoCode: 'ISO',
    dialingCode: 'Indicatif',
    capital: 'Capitale'
  },
  cities: {
    TITLE: 'Villes',
    ENTITY: 'Ville',
    flag: 'Drapeau',
    code: 'Code',
    name: 'Nom',
    nameAr: 'Nom (AR)',
    isCapital: 'Capitale',
    population: 'Population',
    populationFormatted: 'Population'
  },
  TABS: { ALL: 'Toutes les villes', TOP: 'Les plus peuplées' },
  SEARCH: 'Rechercher',
  FILTER: 'Filtrer',
  FILTERS: 'Filtres',
  CLEAR: 'Effacer',
  ADD: 'Ajouter',
  CLOSE: 'Fermer',
  SAVE: 'Enregistrer',
  NO_OPTIONS: 'Aucune option',
  NO_RESULTS_FOUND: 'Aucun résultat',
  details: 'Détails',
  edit: 'Modifier',
  Delete: 'Supprimer',
  Cancel: 'Annuler',
  DETECT_CHANGES: 'Modifications non enregistrées',
  ASK_SAVE_CHANGES: 'Voulez-vous enregistrer vos modifications ?',
  CONFIRMATION_SAVE: 'Enregistrer',
  CONFIRMATION_SAVE_CANCEL: 'Abandonner',
  UNCOMPLETED_FORM: 'Formulaire incomplet',
  FILL_MISSING_FIELDS: 'Veuillez renseigner les champs obligatoires.',
  PAGINATOR: {
    ITEMS_PER_PAGE: 'Éléments par page :',
    NEXT_PAGE: 'Page suivante',
    PREVIOUS_PAGE: 'Page précédente',
    FIRST_PAGE: 'Première page',
    LAST_PAGE: 'Dernière page',
    RANGE: '{{start}} – {{end}} sur {{length}}'
  },

  app: {
    SKIP: 'Aller au contenu',
    PAGES: 'Pages de démonstration',
    THEME: 'Thème',
    LANGUAGE: 'Langue',
    CHOOSE_LANGUAGE: 'Choisir la langue',
    GITHUB: 'GitHub',
    NPM: 'npm',
    FOOTER_LICENSE: 'Open source sous licence MIT.',
    FOOTER_CONTRIBUTE: 'Les contributions sont les bienvenues.',
    FOOTER_DATA: 'Données de démonstration : GeoNames (CC BY 4.0) et Wikipédia (CC BY-SA 4.0).'
  },
  nav: { overview: 'Présentation', countries: 'Pays et villes', tabs: 'Onglets enfants', cities: 'Villes', builder: 'Constructeur' },
  continents: {
    ARIA: 'Parcourir par continent',
    all: 'Tous',
    africa: 'Afrique',
    asia: 'Asie',
    europe: 'Europe',
    northAmerica: 'Amérique du Nord',
    southAmerica: 'Amérique du Sud',
    oceania: 'Océanie'
  },
  theme: { light: 'Clair', dark: 'Sombre', ARIA: 'Thème {{name}}' },
  units: {
    LABEL: 'Population',
    auto: 'Auto',
    units: 'Unités',
    thousands: 'Milliers',
    millions: 'Millions',
    auto_hint: 'K, M ou Md selon la valeur',
    units_hint: 'Nombre complet avec séparateurs de milliers',
    thousands_hint: 'Toujours en K',
    millions_hint: 'Toujours en M'
  },
  code: {
    SHOW: 'Afficher le code de cette page',
    HIDE: 'Masquer le code de cette page',
    FILES: '{{count}} fichiers',
    LINES: '{{count}} lignes',
    COPY: 'Copier',
    COPIED: 'Copié',
    COPY_FILE: 'Copier ce fichier',
    SOURCE_FILES: 'Fichiers source',
    config: 'Colonnes, champs, configuration du tableau',
    html: 'Template',
    ts: 'Composant',
    scss: 'Styles'
  },
  pages: {
    countries: {
      title: 'Les pays et leurs villes',
      subtitle: 'Tous les pays du monde, l’Algérie en premier. Cliquez sur le bouton d’expansion d’une ligne : le tableau enfant charge à la demande les villes de ce pays.'
    },
    tabs: {
      title: 'Tableaux enfants en onglets',
      subtitle: 'Passez un tableau à childConfig et chaque configuration devient un onglet. Dépliez un pays : le premier onglet liste toutes ses villes (modifiable), le second les dix plus peuplées (lecture seule).'
    },
    cities: {
      title: 'Les villes de n’importe quel pays',
      subtitle: 'Choisissez un pays et ses villes se chargent à la demande. Un tableau, un objet de configuration : colonnes typées, filtres d’en-tête (population comprise), icônes d’état, pagination et un dialogue complet d’ajout, de modification, de consultation et de suppression.',
      COUNTRY: 'Pays',
      STAT_CITIES: 'Villes listées',
      STAT_TOTAL: 'Population totale',
      STAT_TOTAL_HINT: 'Somme des populations des villes listées ci-dessous'
    },
    CITIES_OF: 'Villes : {{name}}',
    LARGEST_OF: 'Villes les plus peuplées : {{name}}'
  },
  overview: {
    BADGE: 'Open source · licence MIT',
    HERO_TITLE: 'Presque rien à coder.',
    HERO_LEAD: 'Easy Mat UI transforme un simple objet de configuration en un tableau de données Angular Material complet : filtres, dialogues, tableaux enfants, onglets, thèmes clair et sombre, et cinq langues. Parcourez les exemples : chaque page vous laisse lire son propre code.',
    CTA_NPM: 'Obtenir sur npm',
    CTA_GITHUB: 'Mettre une étoile sur GitHub',
    INSTALL_COPY: 'Copier la commande d’installation',
    INSTALL_COPIED: 'Copié',
    EXPLORE: 'Explorer la démo',
    OPEN_TITLE: 'Libre et open source',
    OPEN_TEXT: 'Easy Mat UI est open source, sous licence MIT. Tout le monde peut l’utiliser, lire son code et aider à l’améliorer : signaler un bug, proposer une fonctionnalité, corriger une faute ou ajouter une langue. Toutes les contributions sont les bienvenues, d’une correction d’une ligne à un nouveau composant.',
    OPEN_REPO: 'Voir le code source',
    OPEN_ISSUES: 'Signaler un problème',
    OPEN_CONTRIBUTE: 'Comment contribuer',
    FEATURES_TITLE: 'Ce que la bibliothèque vous apporte',
    FEATURES_LEAD: 'Tout ce qui suit vient d’un seul objet de configuration. Ouvrez une page de démonstration pour le voir fonctionner.',
    TRY: 'Essayer',
    features: {
      table: { t: 'Tableau de données typé', d: 'Des colonnes de nombreux types (texte, icône, image, nombre, date...) à partir d’une configuration typée.' },
      filters: { t: 'Filtres par colonne', d: 'Filtres texte et à sélection multiple dans l’en-tête, plus une recherche globale, combinés en ET / OU.' },
      paging: { t: 'Tri et pagination', d: 'En-têtes triables, taille de page configurable et en-tête fixe, traduits par ngx-translate.' },
      child: { t: 'Tableaux enfants et onglets', d: 'Des lignes dépliables qui ouvrent un tableau enfant, ou plusieurs, un onglet chacun, chargés à la demande.' },
      dialog: { t: 'Créer, modifier, consulter', d: 'Un dialogue de formulaire avec validation, alerte de modifications non enregistrées et confirmation de suppression.' },
      multi: { t: 'Sélection multiple', d: 'Une sélection multiple réutilisable avec recherche, tout sélectionner et effacer.' },
      themes: { t: 'Thèmes clair et sombre', d: 'Changement à l’exécution avec EasyThemeService. Tout est piloté par des variables CSS.' },
      i18n: { t: 'Multilingue, même de droite à gauche', d: 'Chaque libellé passe par ngx-translate. Cette démo parle anglais, arabe, français, allemand et luxembourgeois.' },
      a11y: { t: 'Adaptatif et accessible', d: 'Utilisable au clavier, focus visible, et aucune violation WCAG 2 A/AA trouvée par axe-core.' }
    },
    STEPS_ARIA: 'Comment ça marche',
    steps: {
      describe: { t: 'Décrire', d: 'Colonnes, champs du dialogue, filtres, actions et tableaux enfants tiennent dans un seul fichier de configuration.' },
      drop: { t: 'Intégrer', d: 'Un composant dans le template : <lib-easy-table [config]="config">.' },
      done: { t: 'Terminé', d: 'Recherche, tri, pagination, dialogues, lignes dépliables, onglets, thèmes et i18n sont gérés par la bibliothèque.' }
    },
    IDEA_TITLE: 'Toute l’idée en 12 lignes',
    COMPAT_TITLE: 'Compatibilité Angular',
    COMPAT_TEXT: 'Vérifiée en compilant et en exécutant la bibliothèque empaquetée dans des applications vierges.',
    compat: {
      ANGULAR: 'Angular',
      STATUS: 'Statut',
      DETAILS: 'Détails',
      ok: 'Pris en charge',
      warn: 'Fonctionne, non officiel',
      no: 'Ne fonctionne pas',
      note20: 'Plage de peer dependencies ^20.0.0.',
      note1921: 'Compile et s’exécute ; installer avec --legacy-peer-deps.',
      note18: 'Le tableau échoue à l’exécution avec Material 18.',
      note1617: 'La compilation échoue (nécessite @let, Angular 18.1+).'
    },
    CONTRIBUTE_TITLE: 'Rejoignez le projet',
    CONTRIBUTE_LEAD: 'Inutile d’être expert. Choisissez ce qui vous convient.',
    ways: {
      bug: { t: 'Signaler un bug', d: 'Un comportement inattendu ? Ouvrez une issue avec les étapes pour le reproduire.' },
      idea: { t: 'Proposer une fonctionnalité', d: 'Dites-nous ce qui rendrait la bibliothèque plus utile pour vous.' },
      lang: { t: 'Ajouter une langue', d: 'Les traductions sont de simples dictionnaires TypeScript : copiez-en un et traduisez-le.' },
      code: { t: 'Envoyer une pull request', d: 'Corrigez un bug, améliorez la documentation ou créez une fonctionnalité. Les tests et la CI s’exécutent à chaque pull request.' }
    },
    FLOW_ARIA: 'Contribuer en trois étapes',
    flow: {
      fork: 'Forkez le dépôt et clonez-le',
      branch: 'Créez une branche, faites votre modification, lancez les tests',
      pr: 'Ouvrez une pull request : nous la relisons ensemble'
    },
    STAR_PLEASE: 'Si la bibliothèque vous aide, une étoile sur GitHub aide d’autres personnes à la trouver.'
  },
  builder: {
    TITLE: 'Constructeur de pages',
    SUBTITLE: 'Choisissez les composants, configurez-les et obtenez le template, le TypeScript et les modèles. La commande peut aussi écrire les fichiers dans votre projet.',
    STEP_PAGE: 'Page',
    STEP_COMPONENTS: 'Composants',
    STEP_SETTINGS: 'Réglages',
    PAGE_NAME: 'Nom de la page',
    PAGE_NAME_HINT: 'Minuscules et tirets. Le dossier, les fichiers et le sélecteur en découlent.',
    TEXTS: 'Textes',
    TEXTS_KEYS: 'Clés de traduction',
    TEXTS_PLAIN: 'Textes simples',
    TEXTS_HINT_KEYS: 'Le code lit les textes avec ngx-translate et les entrées du fichier anglais sont générées.',
    TEXTS_HINT_PLAIN: 'Les textes sont écrits dans le code : aucune bibliothèque de traduction n’est nécessaire.',
    SELECT_ONE: 'Choisissez au moins un composant.',
    categories: {
      Page: 'Page',
      Data: 'Données',
      Navigation: 'Navigation',
      Content: 'Contenu',
      Settings: 'Réglages'
    },
    components: {
      'page-header': { t: 'En-tête de page', d: 'Icône, titre et sous-titre.' },
      stat: { t: 'Chiffres clés', d: 'Quelques nombres avec un libellé et une tonalité.' },
      'chip-nav': {
        t: 'Boutons de catégories',
        d: 'Icône, couleur et compteur pour parcourir par catégorie.'
      },
      segmented: { t: 'Contrôle segmenté', d: 'Un choix parmi quelques-uns : un réglage, une vue.' },
      'language-switch': { t: 'Sélecteur de langue', d: 'Un menu ou des boutons pour choisir la langue.' },
      'card-grid': { t: 'Grille de cartes', d: 'Icône, titre et description dans une grille adaptative.' },
      table: {
        t: 'Tableau de données',
        d: 'Filtres, pagination, ajout / modification / suppression, et un tableau enfant.'
      }
    },
    f: {
      title: 'Titre',
      subtitle: 'Sous-titre',
      icon: 'Icône',
      label: 'Libellé',
      value: 'Valeur',
      color: 'Couleur',
      count: 'Nombre',
      description: 'Description',
      tone: 'Tonalité',
      clickable: 'Cliquable',
      name: 'Nom',
      type: 'Type'
    },
    ADD_ROW: 'Ajouter',
    REMOVE_ROW: 'Supprimer',
    tones: {
      neutral: 'Neutre',
      accent: 'Accent',
      success: 'Succès',
      warning: 'Alerte',
      danger: 'Danger'
    },
    MODEL: 'Modèle',
    MODEL_GENERIC: 'Modèle générique (item1, item2, item3)',
    MODEL_OWN: 'Mes propres champs',
    FIELDS: 'Champs',
    CHILD: 'Tableau enfant sous chaque ligne',
    CAN_CREATE: 'Ajouter',
    CAN_UPDATE: 'Modifier',
    CAN_DELETE: 'Supprimer',
    FILTERS: 'Filtres de colonnes',
    PAGE_SIZE: 'Lignes par page',
    types: { string: 'Texte', number: 'Nombre', boolean: 'Oui / non', date: 'Date' },
    LAYOUT: 'Disposition',
    layouts: { menu: 'Menu', inline: 'Boutons' },
    DISPLAY: 'Affiche',
    displays: { 'flag-name': 'Drapeau et nom', flag: 'Drapeau', name: 'Nom', code: 'Code' },
    LANGUAGES: 'Langues',
    ICON_ONLY: 'Icônes seulement',
    SIZE: 'Taille',
    COLUMNS: 'Colonnes',
    PREVIEW: 'Aperçu',
    PREVIEW_TABLE_NOTE: 'Le tableau est affiché avec des lignes d’exemple (le tableau enfant n’est pas affiché).',
    CODE: 'Code généré',
    TRANSLATIONS_TAB: 'Entrées anglaises',
    TRANSLATIONS_HINT: 'Ajoutez ces entrées à votre fichier de traduction anglais. La commande le fait à votre place.',
    NOTES: 'Bon à savoir',
    COMMAND: 'Ou écrire les fichiers dans votre projet',
    COMMAND_TEXT: 'Téléchargez la description, puis lancez la commande à la racine de votre projet Angular.',
    DOWNLOAD: 'Télécharger la description',
    COPY_COMMAND: 'Copier la commande',
    ERROR: 'Cette page ne peut pas encore être générée'
  }
};
