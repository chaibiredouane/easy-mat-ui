import { Dir } from '@angular/cdk/bidi';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { EasyThemeMode, EasyThemeService } from 'easy-mat-ui-ng20';
import { Cities } from './pages/cities/cities';
import { Countries } from './pages/countries/countries';
import { CountryTabs } from './pages/country-tabs/country-tabs';
import { Overview } from './pages/overview/overview';
import { LanguageService } from './services/language.service';
import { GithubMark } from './shared/github-mark/github-mark';
import { LanguageSwitch } from './shared/language-switch/language-switch';
import { LINKS } from './shared/links';

/** `label` is a key of the dictionaries (`nav.<id>`). */
const PAGES = [
  { id: 'overview', icon: 'home' },
  { id: 'countries', icon: 'public' },
  { id: 'tabs', icon: 'tab' },
  { id: 'cities', icon: 'map' }
] as const;

const THEMES: { id: EasyThemeMode; icon: string }[] = [
  { id: 'light', icon: 'light_mode' },
  { id: 'dark', icon: 'dark_mode' },
  { id: 'system', icon: 'brightness_auto' }
];

@Component({
  selector: 'app-root',
  imports: [Dir, MatTabsModule, MatIconModule, TranslatePipe, GithubMark, LanguageSwitch, Overview, Countries, CountryTabs, Cities],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly theme = inject(EasyThemeService);
  readonly lang = inject(LanguageService);

  readonly links = LINKS;
  readonly pages = PAGES;
  readonly themes = THEMES;
  readonly index = signal(0);
  readonly mode = this.theme.mode;

  constructor() {
    // The demo opens in the dark theme; the visitor can switch to light or to the system preference.
    this.theme.setTheme('dark');
  }

  setTheme(mode: EasyThemeMode): void {
    this.theme.setTheme(mode);
  }

  open(id: string): void {
    this.index.set(Math.max(0, PAGES.findIndex((p) => p.id === id)));
  }
}
