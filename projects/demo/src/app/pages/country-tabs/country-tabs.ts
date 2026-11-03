import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EasyTableComponent, EasyTableConfig, EasyTableDialogResult } from 'easy-mat-ui-ng20';
import { City, CityRow, Country } from '../../models/geo.model';
import { DisplaySettings } from '../../services/display-settings';
import { GeoService } from '../../services/geo.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { isSave } from '../../shared/dialog';
import { PageHeader } from '../../shared/page-header/page-header';
import { UnitSwitch } from '../../shared/unit-switch/unit-switch';
import { cityRows, toCity } from '../cities/cities.config';
import { countryTable } from '../countries/countries.config';
import { cityTabs } from './country-tabs.config';

@Component({
  selector: 'app-country-tabs',
  imports: [EasyTableComponent, PageHeader, UnitSwitch, CodePanel],
  templateUrl: './country-tabs.html',
  styleUrl: './country-tabs.scss'
})
export class CountryTabs implements OnInit {
  private readonly api = inject(GeoService);
  private readonly display = inject(DisplaySettings);

  isReady = false;
  tableConfig!: EasyTableConfig<Country>;
  tabsConfig: EasyTableConfig<any>[] = [];

  private cities: City[] = [];
  private current: Country | null = null;

  constructor() {
    effect(() => {
      this.display.unit();
      this.display.locale();
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
    this.tabsConfig = cityTabs({
      all: cityRows(this.cities, this.display.unit(), this.display.locale()),
      countryName: this.current?.name ?? ''
    });
  }
}
