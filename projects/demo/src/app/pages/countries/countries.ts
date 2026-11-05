import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { EasyPageHeader, EasyTableComponent, EasyTableConfig, EasyTableDialogResult } from 'easy-mat-ui-ng20';
import { inContinent } from '../../data/continents';
import { City, CityRow, Country } from '../../models/geo.model';
import { DisplaySettings } from '../../services/display-settings';
import { GeoService } from '../../services/geo.service';
import { LanguageService } from '../../services/language.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { ContinentNav } from '../../shared/continent-nav/continent-nav';
import { isSave } from '../../shared/dialog';
import { UnitSwitch } from '../../shared/unit-switch/unit-switch';
import { cityRows, cityTable, toCity } from '../cities/cities.config';
import { countryTable } from './countries.config';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-countries',
  imports: [EasyTableComponent, EasyPageHeader, UnitSwitch, ContinentNav, CodePanel, TranslatePipe],
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

  /** Shared with the other pages that list countries. */
  continent = this.display.continent;
  readonly isoCodes = signal<string[]>([]);

  private allCountries: Country[] = [];
  private cities: City[] = [];
  private current: Country | null = null;

  constructor() {
    effect(() => {
      this.display.unit();
      this.lang.current();
      untracked(() => this.refreshChildTable());
    });
    // Another continent: the table lists only its countries.
    effect(() => {
      this.continent();
      untracked(() => this.refreshCountries());
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
    this.allCountries = await firstValueFrom(this.api.getCountries());
    this.isoCodes.set(this.allCountries.map((c) => c.isoCode));
    this.refreshCountries();
  }

  private refreshCountries(): void {
    if (this.allCountries.length === 0) return;
    const continent = this.continent();
    this.tableConfig = countryTable({ data: this.allCountries.filter((c) => inContinent(c.isoCode, continent)) });
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
