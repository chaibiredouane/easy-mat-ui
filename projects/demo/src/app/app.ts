import { BreakpointObserver } from '@angular/cdk/layout';
import { Dir } from '@angular/cdk/bidi';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  EasyLanguage,
  EasyLanguageSwitch,
  EasySegmented,
  EasySegmentedOption,
  EasyThemeMode,
  EasyThemeService
} from 'easy-mat-ui-ng20';
import { map } from 'rxjs';
import { LANGUAGES } from './i18n/languages';
import { Builder } from './pages/builder/builder';
import { Cities } from './pages/cities/cities';
import { Countries } from './pages/countries/countries';
import { CountryTabs } from './pages/country-tabs/country-tabs';
import { Overview } from './pages/overview/overview';
import { LanguageService } from './services/language.service';
import { GithubMark } from './shared/github-mark/github-mark';
import { LINKS } from './shared/links';

/** The label of a page is the key `nav.<id>` of the dictionaries. */
const PAGES = [
  { id: 'overview', icon: 'home' },
  { id: 'countries', icon: 'public' },
  { id: 'tabs', icon: 'tab' },
  { id: 'cities', icon: 'map' },
  { id: 'builder', icon: 'build' }
] as const;

/** The demo offers two themes. (EasyThemeService also has a 'system' mode, which the demo does not expose.) */
const THEMES: { id: EasyThemeMode; icon: string }[] = [
  { id: 'light', icon: 'light_mode' },
  { id: 'dark', icon: 'dark_mode' }
];

@Component({
  selector: 'app-root',
  imports: [Dir, MatIconModule, TranslatePipe, GithubMark, EasySegmented, EasyLanguageSwitch, Overview, Countries, CountryTabs, Cities, Builder],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly theme = inject(EasyThemeService);
  private readonly translate = inject(TranslateService);
  readonly lang = inject(LanguageService);

  readonly links = LINKS;
  readonly pages = PAGES;
  readonly index = signal(0);
  readonly mode = this.theme.mode;

  /** Below 600px the list of pages takes the whole width of the header. */
  readonly mobile = toSignal(inject(BreakpointObserver).observe('(max-width: 600px)').pipe(map((state) => state.matches)), {
    initialValue: false
  });

  // The three controls below are components of easy-mat-ui: the demo only gives them its texts and its choices.
  readonly pageOptions = computed<EasySegmentedOption[]>(() => {
    this.lang.current(); // the texts change with the language
    return PAGES.map((page) => ({ id: page.id, icon: page.icon, label: this.translate.instant(`nav.${page.id}`) }));
  });

  readonly themeOptions = computed<EasySegmentedOption[]>(() => {
    this.lang.current();
    return THEMES.map((theme) => {
      const name = this.translate.instant(`theme.${theme.id}`);
      return { id: theme.id, icon: theme.icon, label: name, hint: this.translate.instant('theme.ARIA', { name }) };
    });
  });

  readonly languages: EasyLanguage[] = LANGUAGES.map(({ code, name, flag }) => ({ code, name, flag }));

  constructor() {
    // The demo opens in the dark theme; the visitor can switch to the light one.
    this.theme.setTheme('dark');
  }

  setTheme(mode: string): void {
    this.theme.setTheme(mode as EasyThemeMode);
  }

  open(id: string): void {
    this.index.set(Math.max(0, PAGES.findIndex((page) => page.id === id)));
  }
}
