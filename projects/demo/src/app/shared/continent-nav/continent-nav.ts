import { Component, computed, inject, input, model } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EasyChipNav, EasyChipNavItem } from 'easy-mat-ui-ng20';
import { CONTINENTS, ContinentFilter, inContinent } from '../../data/continents';
import { LanguageService } from '../../services/language.service';

/**
 * Navigation by continent. The buttons themselves are the `lib-easy-chip-nav` of easy-mat-ui: this component only
 * turns the continents of the demo (name in the current language, icon, colour, number of countries) into its items.
 */
@Component({
  selector: 'app-continent-nav',
  imports: [EasyChipNav, TranslatePipe],
  templateUrl: './continent-nav.html',
  // A custom element is inline by default, which made the margin set by the pages (space before the table) ignored.
  styles: [':host { display: block; }']
})
export class ContinentNav {
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  /** ISO codes of every country of the page: they give the count shown on each button. */
  isoCodes = input.required<readonly string[]>();
  selected = model.required<ContinentFilter>();

  readonly items = computed<EasyChipNavItem[]>(() => {
    this.lang.current(); // the names change with the language
    return CONTINENTS.map((continent) => ({
      id: continent.id,
      label: this.translate.instant(`continents.${continent.id}`),
      icon: continent.icon,
      color: continent.color,
      count: this.isoCodes().filter((code) => inContinent(code, continent.id)).length
    }));
  });
}
