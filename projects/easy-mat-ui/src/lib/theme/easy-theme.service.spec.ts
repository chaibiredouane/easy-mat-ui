import { TestBed } from '@angular/core/testing';
import { EASY_THEME_OPTIONS, EasyThemeOptions, EasyThemeService } from './easy-theme.service';

describe('EasyThemeService', () => {
  let listener: ((e: MediaQueryListEvent) => void) | null;
  let prefersDark: boolean;

  function fakeMatchMedia(): void {
    listener = null;
    spyOn(window, 'matchMedia').and.callFake(() => ({
      get matches() { return prefersDark; },
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => { listener = cb; },
      removeEventListener: () => { listener = null; }
    } as unknown as MediaQueryList));
  }

  function create(options?: EasyThemeOptions): EasyThemeService {
    TestBed.configureTestingModule({ providers: options ? [{ provide: EASY_THEME_OPTIONS, useValue: options }] : [] });
    return TestBed.inject(EasyThemeService);
  }

  beforeEach(() => {
    prefersDark = false;
    document.body.classList.remove('dark-theme');
    document.documentElement.removeAttribute('data-easy-theme');
    document.documentElement.style.colorScheme = '';
    fakeMatchMedia();
  });

  afterEach(() => {
    localStorage.removeItem('easy-test-theme');
    document.body.classList.remove('dark-theme');
  });

  it('does not touch the host application until a theme is chosen', () => {
    const service = create();
    expect(service.mode()).toBeNull();
    expect(service.theme()).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
    expect(document.documentElement.hasAttribute('data-easy-theme')).toBeFalse();
  });

  it('applies dark and light at runtime', () => {
    const service = create();
    service.setTheme('dark');
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    expect(document.documentElement.getAttribute('data-easy-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    service.setTheme('light');
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
    expect(document.documentElement.getAttribute('data-easy-theme')).toBe('light');
  });

  it('follows the operating system in system mode, live', () => {
    prefersDark = true;
    const service = create();
    service.setTheme('system');
    expect(service.mode()).toBe('system');
    expect(service.theme()).toBe('dark');
    expect(document.body.classList.contains('dark-theme')).toBeTrue();

    listener?.({ matches: false } as MediaQueryListEvent);
    expect(service.theme()).toBe('light');
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });

  it('toggles between light and dark', () => {
    const service = create();
    service.toggle();
    expect(service.theme()).toBe('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('applies the configured initial theme and a custom class', () => {
    create({ initial: 'dark', darkClass: 'night', attribute: null });
    expect(document.body.classList.contains('night')).toBeTrue();
    expect(document.documentElement.hasAttribute('data-easy-theme')).toBeFalse();
    document.body.classList.remove('night');
  });

  it('remembers the mode only when a storage key is configured', () => {
    const service = create({ storageKey: 'easy-test-theme' });
    service.setTheme('dark');
    expect(localStorage.getItem('easy-test-theme')).toBe('dark');

    TestBed.resetTestingModule();
    document.body.classList.remove('dark-theme');
    const restored = create({ storageKey: 'easy-test-theme' });
    expect(restored.mode()).toBe('dark');
  });
});
