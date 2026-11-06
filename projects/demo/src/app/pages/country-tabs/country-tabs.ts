import { ChangeDetectionStrategy, Component, effect, inject, OnInit, untracked } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { EasyPageHeader, EasyTableComponent, EasyTableConfig, EasyTableDialogResult } from 'easy-mat-ui';
import { City, CityRow, Country } from '../../models/geo.model';
import { DisplaySettings } from '../../services/display-settings';
import { GeoService } from '../../services/geo.service';
import { LanguageService } from '../../services/language.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { isSave } from '../../shared/dialog';
import { UnitSwitch } from '../../shared/unit-switch/unit-switch';
import { cityRows, toCity } from '../cities/cities.config';
import { countryTable } from '../countries/countries.config';
import { cityTabs } from './country-tabs.config';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-country-tabs',
  imports: [EasyTableComponent, EasyPageHeader, UnitSwitch, CodePanel, TranslatePipe],
  templateUrl: './country-tabs.html',
  styleUrl: './country-tabs.scss'
})
export class CountryTabs implements OnInit {
  private readonly api = inject(GeoService);
  private readonly display = inject(DisplaySettings);
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  isReady = false;
  tableConfig!: EasyTableConfig<Country>;
  tabsConfig: EasyTableConfig<any>[] = [];

  private cities: City[] = [];
  private current: Country | null = null;

  constructor() {
    effect(() => {
      this.display.unit();
      this.lang.current();
      untracked(() => this.refreshTabs());
    });
  }

  async ngOnInit(): Promise<void> {
    this.tableConfig = countryTable({ data: await firstValueFrom(this.api.getCountries()), readonly: true });
    this.isReady = true;
  }

  async onExtendRow(country: Country | null): Promise<void> {
    this.current = country;
    this.cities = country ? await firstValueFrom(this.api.getCities(country.id)) : [];
    this.refreshTabs();
  }

  /** The second tab is read-only, so every dialog result comes from the first one. */
  async onChildDialogResult({ result }: EasyTableDialogResult<CityRow>): Promise<void> {
    if (isSave(result) && this.current) {
      await firstValueFrom(this.api.saveCity({ ...toCity(result.data!), countryId: this.current.id }));
      await this.onExtendRow(this.current);
    }
  }

  async onDeleteChild(item: object): Promise<void> {
    await firstValueFrom(this.api.deleteCity(toCity(item as CityRow)));
    await this.onExtendRow(this.current);
  }

  private refreshTabs(): void {
    const name = this.current ? this.lang.countryName(this.current.isoCode, this.current.name) : '';
    this.tabsConfig = cityTabs({
      all: cityRows(this.cities, this.display.unit(), this.display.locale()),
      allTitle: this.translate.instant('pages.CITIES_OF', { name }),
      topTitle: this.translate.instant('pages.LARGEST_OF', { name })
    });
  }
}
