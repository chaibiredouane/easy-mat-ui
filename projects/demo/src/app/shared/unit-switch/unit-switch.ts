import { Component, inject } from '@angular/core';
import { DisplaySettings } from '../../services/display-settings';
import { POPULATION_UNITS, PopulationUnit } from '../population';

/** Population unit and locale selector: it only changes display settings, never the data. */
@Component({
  selector: 'app-unit-switch',
  templateUrl: './unit-switch.html',
  styleUrl: './unit-switch.scss'
})
export class UnitSwitch {
  readonly settings = inject(DisplaySettings);
  readonly units = POPULATION_UNITS;

  setUnit(unit: PopulationUnit): void {
    this.settings.unit.set(unit);
  }

  setLocale(event: Event): void {
    this.settings.locale.set((event.target as HTMLSelectElement).value);
  }
}
