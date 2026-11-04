import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { EasyTableComponent, EasyTableConfig, EasyTableDialogResult } from 'easy-mat-ui-ng20';
import { City, CityRow, Country } from '../../models/geo.model';
import { DisplaySettings } from '../../services/display-settings';
import { GeoService } from '../../services/geo.service';
import { LanguageService } from '../../services/language.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { isSave } from '../../shared/dialog';
import { PageHeader } from '../../shared/page-header/page-header';
import { UnitSwitch } from '../../shared/unit-switch/unit-switch';
import { cityRows, cityTable, toCity } from './cities.config';

@Component({
  selector: 'app-cities',
  imports: [EasyTableComponent, PageHeader, UnitSwitch, CodePanel, TranslatePipe],
  templateUrl: './cities.html',
  styleUrl: './cities.scss'
})
export class Cities implements OnInit {
  private readonly api = inject(GeoService);
  private readonly display = inject(DisplaySettings);
  private readonly translate = inject(TranslateService);
  readonly lang = inject(LanguageService);

  isReady = false;
  countries: Country[] = [];
  country!: Country;
  tableConfig!: EasyTableConfig<CityRow>;
  private cities: City[] = [];

  constructor() {
    // The unit or the language changed (the language also changes the number format): build the table again.
    effect(() => {
      this.display.unit();
      this.lang.current();
      untracked(() => this.refreshTable());
    });
  }

  async ngOnInit(): Promise<void> {
    this.countries = await firstValueFrom(this.api.getCountries());
    this.country = this.countries[0]; // Algeria is first
    await this.load();
    this.isReady = true;
  }

  /** Country name in the language of the demo (the data itself keeps the English name). */
  countryLabel(country: Country): string {
    return this.lang.countryName(country.isoCode, country.name);
  }

  async onCountryChange(event: Event): Promise<void> {
    const id = Number((event.target as HTMLSelectElement).value);
    this.country = this.countries.find((c) => c.id === id) ?? this.countries[0];
    await this.load();
  }

  async onDialogResult({ result }: EasyTableDialogResult<CityRow>): Promise<void> {
    if (isSave(result)) {
      await firstValueFrom(this.api.saveCity({ ...toCity(result.data!), countryId: this.country.id }));
      await this.load();
    }
  }

  async onDelete(item: object): Promise<void> {
    await firstValueFrom(this.api.deleteCity(toCity(item as CityRow)));
    await this.load();
  }

  private async load(): Promise<void> {
    this.cities = await firstValueFrom(this.api.getCities(this.country.id));
    this.refreshTable();
  }

  private refreshTable(): void {
    if (!this.country) return;
    this.tableConfig = cityTable({
      data: cityRows(this.cities, this.display.unit(), this.display.locale(), this.country.code),
      title: this.translate.instant('pages.CITIES_OF', { name: this.countryLabel(this.country) }),
      localNames: this.cities.some((c) => !!c.nameAr)
    });
  }
}
