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
import { cityRows, cityTable, toCity } from '../cities/cities.config';
import { countryTable } from './countries.config';

@Component({
  selector: 'app-countries',
  imports: [EasyTableComponent, PageHeader, UnitSwitch, CodePanel, TranslatePipe],
  templateUrl: './countries.html',
  styleUrl: './countries.scss'
})
export class Countries implements OnInit {
  private readonly api = inject(GeoService);
  private readonly display = inject(DisplaySettings);
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  isReady = false;
  tableConfig!: EasyTableConfig<Country>;
  tableChildConfig!: EasyTableConfig<CityRow>;

  private cities: City[] = [];
  private current: Country | null = null;

  constructor() {
    effect(() => {
      this.display.unit();
      this.lang.current();
      untracked(() => this.refreshChildTable());
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadCountries();
    this.isReady = true;
  }

  // ---- parent -------------------------------------------------------------
  async onDialogResult({ result }: EasyTableDialogResult<Country>): Promise<void> {
    if (isSave(result)) {
      await firstValueFrom(this.api.saveCountry(result.data!));
      await this.loadCountries();
    }
  }

  async onDelete(item: object): Promise<void> {
    await firstValueFrom(this.api.deleteCountry(item as Country));
    await this.loadCountries();
  }

  // ---- child --------------------------------------------------------------
  async onExtendRow(country: Country | null): Promise<void> {
    this.current = country;
    this.cities = country ? await firstValueFrom(this.api.getCities(country.id)) : [];
    this.refreshChildTable();
  }

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

  private async loadCountries(): Promise<void> {
    this.tableConfig = countryTable({ data: await firstValueFrom(this.api.getCountries()) });
  }

  private refreshChildTable(): void {
    this.tableChildConfig = cityTable({
      data: cityRows(this.cities, this.display.unit(), this.display.locale()),
      title: this.current
        ? this.translate.instant('pages.CITIES_OF', { name: this.lang.countryName(this.current.isoCode, this.current.name) })
        : this.translate.instant('cities.TITLE'),
      compact: true
    });
  }
}
