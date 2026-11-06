import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EasySegmented, EasySegmentedOption } from 'easy-mat-ui';
import { DisplaySettings } from '../../services/display-settings';
import { LanguageService } from '../../services/language.service';
import { POPULATION_UNITS, PopulationUnit } from '../population';

/**
 * Population unit selector: it only changes display settings, never the data. The number format (separators,
 * digits) follows the language of the demo. The buttons are the `lib-easy-segmented` of easy-mat-ui.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-unit-switch',
  imports: [EasySegmented, TranslatePipe],
  templateUrl: './unit-switch.html',
  styleUrl: './unit-switch.scss'
})
export class UnitSwitch {
  readonly settings = inject(DisplaySettings);
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  readonly options = computed<EasySegmentedOption[]>(() => {
    this.lang.current(); // the texts change with the language
    return POPULATION_UNITS.map((unit) => ({
      id: unit,
      label: this.translate.instant(`units.${unit}`),
      hint: this.translate.instant(`units.${unit}_hint`)
    }));
  });

  setUnit(unit: string): void {
    this.settings.unit.set(unit as PopulationUnit);
  }
}
