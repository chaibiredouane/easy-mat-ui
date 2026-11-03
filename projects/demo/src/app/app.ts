import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EasyThemeMode, EasyThemeService } from 'easy-mat-ui-ng20';
import { Countries } from './pages/countries/countries';
import { CountryTabs } from './pages/country-tabs/country-tabs';
import { Overview } from './pages/overview/overview';
import { Cities } from './pages/cities/cities';

const PAGES = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'countries', label: 'Countries & cities', icon: 'public' },
  { id: 'tabs', label: 'Child tabs', icon: 'tab' },
  { id: 'cities', label: 'Cities', icon: 'map' }
] as const;

const THEMES: { id: EasyThemeMode; label: string; icon: string }[] = [
  { id: 'light', label: 'Light', icon: 'light_mode' },
  { id: 'dark', label: 'Dark', icon: 'dark_mode' },
  { id: 'system', label: 'System', icon: 'brightness_auto' }
];

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatIconModule, Overview, Countries, CountryTabs, Cities],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly theme = inject(EasyThemeService);

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
