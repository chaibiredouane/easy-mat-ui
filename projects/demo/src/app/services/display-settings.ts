import { inject, Injectable, signal } from '@angular/core';
import { PopulationUnit } from '../shared/population';
import { LanguageService } from './language.service';

/** How populations are displayed. Pages rebuild their table configuration when these change. */
@Injectable({ providedIn: 'root' })
export class DisplaySettings {
  readonly unit = signal<PopulationUnit>('auto');
  /** Number format: it follows the language of the demo, there is no separate setting. */
  readonly locale = inject(LanguageService).locale;
}
