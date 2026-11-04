import { inject, Injectable, signal } from '@angular/core';
import { ContinentFilter } from '../data/continents';
import { PopulationUnit } from '../shared/population';
import { LanguageService } from './language.service';

/** How populations are displayed, and which continent is browsed. Pages rebuild their table when these change. */
@Injectable({ providedIn: 'root' })
export class DisplaySettings {
  readonly unit = signal<PopulationUnit>('auto');
  /** Number format: it follows the language of the demo, there is no separate setting. */
  readonly locale = inject(LanguageService).locale;
  /** Shared by the pages that list countries, so the choice survives a change of page. */
  readonly continent = signal<ContinentFilter>('all');
}
