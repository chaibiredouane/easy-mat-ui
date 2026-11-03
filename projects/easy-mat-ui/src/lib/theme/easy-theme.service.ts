import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, inject, Injectable, InjectionToken, signal } from '@angular/core';

/** Theme the application asks for. `system` follows the operating system preference. */
export type EasyThemeMode = 'light' | 'dark' | 'system';

/** Theme actually applied once `system` has been resolved. */
export type EasyResolvedTheme = 'light' | 'dark';

export interface EasyThemeOptions {
  /** Theme applied when the service is created. Default: none (the host application stays untouched). */
  initial?: EasyThemeMode;
  /** CSS class toggled on `<body>` in dark mode. Default `dark-theme`, the class the library stylesheet targets. */
  darkClass?: string;
  /** Attribute set on `<html>` with the resolved theme (`light` / `dark`). Use `null` to disable. Default `data-easy-theme`. */
  attribute?: string | null;
  /** Also set the CSS `color-scheme` on `<html>` so native controls and scrollbars follow the theme. Default `true`. */
  colorScheme?: boolean;
  /** `localStorage` key used to remember the chosen mode. Default `null`: nothing is stored. */
  storageKey?: string | null;
}

/** Optional configuration of {@link EasyThemeService}: `{ provide: EASY_THEME_OPTIONS, useValue: {...} }`. */
export const EASY_THEME_OPTIONS = new InjectionToken<EasyThemeOptions>('EASY_THEME_OPTIONS');

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Switches the library between light and dark at runtime, without reloading the page.
 *
 * The service does nothing until {@link setTheme} is called (or `initial` is configured), so it never
 * changes the theme of a host application by itself. In dark mode it adds the `dark-theme` class to
 * `<body>`; applications that already toggle that class themselves can keep doing so.
 */
@Injectable({ providedIn: 'root' })
export class EasyThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly options: EasyThemeOptions = { darkClass: 'dark-theme', attribute: 'data-easy-theme', colorScheme: true, storageKey: null, ...inject(EASY_THEME_OPTIONS, { optional: true }) };

  private readonly modeSignal = signal<EasyThemeMode | null>(null);
  private readonly systemDark = signal(false);
  private media: MediaQueryList | null = null;
  private readonly onSystemChange = (event: MediaQueryListEvent) => {
    this.systemDark.set(event.matches);
    this.apply();
  };

  /** Mode requested by the application (`null` until a theme has been chosen). */
  readonly mode = this.modeSignal.asReadonly();

  /** Theme currently applied. `light` while no theme has been chosen. */
  readonly theme = computed<EasyResolvedTheme>(() => {
    const mode = this.modeSignal();
    return mode === 'dark' || (mode === 'system' && this.systemDark()) ? 'dark' : 'light';
  });

  constructor() {
    this.media = this.document.defaultView?.matchMedia?.(DARK_QUERY) ?? null;
    this.systemDark.set(this.media?.matches ?? false);
    this.media?.addEventListener?.('change', this.onSystemChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener?.('change', this.onSystemChange));

    const stored = this.readStored();
    const initial = stored ?? this.options.initial;
    if (initial) {
      this.setTheme(initial);
    }
  }

  /** Applies `light`, `dark` or `system` (follow the operating system, live). */
  setTheme(mode: EasyThemeMode): void {
    this.modeSignal.set(mode);
    this.systemDark.set(this.media?.matches ?? false);
    this.apply();
    this.store(mode);
  }

  /** Switches between light and dark (a `system` mode becomes the opposite of what is shown now). */
  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(): void {
    const dark = this.theme() === 'dark';
    const { darkClass, attribute, colorScheme } = this.options;
    const body = this.document.body;
    const root = this.document.documentElement;
    if (darkClass) {
      body?.classList.toggle(darkClass, dark);
    }
    if (attribute) {
      root?.setAttribute(attribute, this.theme());
    }
    if (colorScheme && root) {
      root.style.colorScheme = this.theme();
    }
  }

  private readStored(): EasyThemeMode | null {
    const key = this.options.storageKey;
    if (!key) {
      return null;
    }
    try {
      const value = this.document.defaultView?.localStorage.getItem(key);
      return value === 'light' || value === 'dark' || value === 'system' ? value : null;
    } catch {
      return null;
    }
  }

  private store(mode: EasyThemeMode): void {
    const key = this.options.storageKey;
    if (!key) {
      return;
    }
    try {
      this.document.defaultView?.localStorage.setItem(key, mode);
    } catch {
      /* storage unavailable (private mode, SSR): the theme still applies for this session */
    }
  }
}
