import { Injectable, signal } from '@angular/core';
import { PopulationUnit } from '../shared/population';

/** How populations are displayed. Pages rebuild their table configuration when these change. */
@Injectable({ providedIn: 'root' })
export class DisplaySettings {
  readonly unit = signal<PopulationUnit>('auto');
  readonly locale = signal('en');
}
