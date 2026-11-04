import { Dir } from '@angular/cdk/bidi';
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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

/** The label of a page is the key `nav.<id>` of the dictionaries. */
const PAGES = [
  { id: 'overview', icon: 'home' },
  { id: 'countries', icon: 'public' },
  { id: 'tabs', icon: 'tab' },
  { id: 'cities', icon: 'map' }
] as const;

/** The demo offers two themes. (EasyThemeService also has a 'system' mode, which the demo does not expose.) */
const THEMES: { id: EasyThemeMode; icon: string }[] = [
  { id: 'light', icon: 'light_mode' },
  { id: 'dark', icon: 'dark_mode' }
];

@Component({
  selector: 'app-root',
  imports: [Dir, MatIconModule, TranslatePipe, GithubMark, LanguageSwitch, Overview, Countries, CountryTabs, Cities],
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

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  constructor() {
    // The demo opens in the dark theme; the visitor can switch to the light one.
    this.theme.setTheme('dark');
  }

  setTheme(mode: EasyThemeMode): void {
    this.theme.setTheme(mode);
  }

  open(id: string): void {
    this.index.set(Math.max(0, PAGES.findIndex((p) => p.id === id)));
  }

  /** Arrow keys move between the tabs (Home and End jump to the ends), as in any tab list. */
  onTabKeydown(event: KeyboardEvent): void {
    const last = PAGES.length - 1;
    // In a right-to-left language the next tab is on the left.
    const forward = this.lang.dir() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = this.lang.dir() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let target: number;
    if (event.key === forward) target = this.index() === last ? 0 : this.index() + 1;
    else if (event.key === backward) target = this.index() === 0 ? last : this.index() - 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = last;
    else return;
    event.preventDefault();
    this.index.set(target);
    this.tabButtons()[target]?.nativeElement.focus();
  }
}
