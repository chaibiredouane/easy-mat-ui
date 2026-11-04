import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DisplaySettings } from '../../services/display-settings';
import { POPULATION_UNITS, PopulationUnit } from '../population';

/**
 * Population unit selector: it only changes display settings, never the data. The number format
 * (separators, digits) follows the language of the demo.
 */
@Component({
  selector: 'app-unit-switch',
  imports: [TranslatePipe],
  templateUrl: './unit-switch.html',
  styleUrl: './unit-switch.scss'
})
export class UnitSwitch {
  readonly settings = inject(DisplaySettings);
  readonly units = POPULATION_UNITS;

  setUnit(unit: PopulationUnit): void {
    this.settings.unit.set(unit);
  }
}
