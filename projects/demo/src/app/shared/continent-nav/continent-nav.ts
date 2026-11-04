import { Component, computed, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTINENTS, ContinentFilter, inContinent } from '../../data/continents';

/**
 * Navigation by continent: one button per continent, with its own icon and colour and the number of countries.
 * The choice is a two-way `selected` model, so a page binds it to a signal with `[(selected)]`.
 */
@Component({
  selector: 'app-continent-nav',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './continent-nav.html',
  styleUrl: './continent-nav.scss'
})
export class ContinentNav {
  /** ISO codes of every country of the page: they give the count shown on each button. */
  isoCodes = input.required<readonly string[]>();
  selected = model.required<ContinentFilter>();

  readonly items = computed(() =>
    CONTINENTS.map((c) => ({ ...c, count: this.isoCodes().filter((code) => inContinent(code, c.id)).length }))
  );
}
