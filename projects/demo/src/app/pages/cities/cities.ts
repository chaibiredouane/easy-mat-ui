import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  Dictionary,
  EasyMultiSelect,
  EasyPageHeader,
  EasyStat,
  EasyTableComponent,
  EasyTableConfig,
  EasyTableDialogResult
} from 'easy-mat-ui-ng20';
import { inContinent } from '../../data/continents';
import { City, CityRow, Country } from '../../models/geo.model';
import { DisplaySettings } from '../../services/display-settings';
import { GeoService } from '../../services/geo.service';
import { LanguageService } from '../../services/language.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { ContinentNav } from '../../shared/continent-nav/continent-nav';
import { isSave } from '../../shared/dialog';
import { exactPopulation, formatPopulation, isRtlLocale, keepLtr } from '../../shared/population';
import { UnitSwitch } from '../../shared/unit-switch/unit-switch';
import { cityRows, cityTable, toCity } from './cities.config';

@Component({
  selector: 'app-cities',
  imports: [EasyTableComponent, EasyMultiSelect, EasyPageHeader, EasyStat, UnitSwitch, ContinentNav, CodePanel, TranslatePipe],
  templateUrl: './cities.html',
  styleUrl: './cities.scss'
})
export class Cities implements OnInit {
  private readonly api = inject(GeoService);
  private readonly display = inject(DisplaySettings);
  private readonly translate = inject(TranslateService);
  readonly lang = inject(LanguageService);

  /** Shared with the other pages that list countries. */
  readonly continent = this.display.continent;

  isReady = false;
  tableConfig!: EasyTableConfig<CityRow>;

  readonly countries = signal<Country[]>([]);
  readonly country = signal<Country | null>(null);
  private readonly cities = signal<City[]>([]);

  readonly isoCodes = computed(() => this.countries().map((c) => c.isoCode));
  private readonly inContinent = computed(() => this.countries().filter((c) => inContinent(c.isoCode, this.continent())));

  /** The dropdown of easy-mat-ui: the countries of the chosen continent, named in the language of the demo. */
  readonly options = computed(() => this.inContinent().map((c) => new Dictionary(String(c.id), this.countryLabel(c))));
  readonly selectedOption = computed(() => {
    const c = this.country();
    return c ? [new Dictionary(String(c.id), this.countryLabel(c))] : [];
  });

  /** What the table shows, summed: the total of the populations of the cities listed below. */
  readonly cityCount = computed(() => this.cities().length);
  private readonly total = computed(() => this.cities().reduce((sum, c) => sum + (c.population ?? 0), 0));
  readonly totalFormatted = computed(() => {
    const text = formatPopulation(this.total(), this.display.unit(), this.display.locale());
    return isRtlLocale(this.display.locale()) ? keepLtr(text) : text; // "35.1 M", not "M 35.1", in Arabic
  });
  readonly totalExact = computed(() => exactPopulation(this.total(), this.display.locale()));

  constructor() {
    // The unit or the language changed (the language also changes the number format): build the table again.
    effect(() => {
      this.display.unit();
      this.lang.current();
      untracked(() => this.refreshTable());
    });

    // The continent changed and the country on screen is not in it any more: open the first country of the continent.
    effect(() => {
      const list = this.inContinent();
      const current = untracked(() => this.country());
      if (current && list.length > 0 && !list.some((c) => c.id === current.id)) {
        const collator = new Intl.Collator(untracked(() => this.lang.current().code));
        const first = [...list].sort((a, b) => collator.compare(this.countryLabel(a), this.countryLabel(b)))[0];
        void untracked(() => this.selectCountry(first));
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.countries.set(await firstValueFrom(this.api.getCountries()));
    // Algeria is the country of the demo, unless the continent chosen on another page does not contain it.
    const list = this.inContinent();
    await this.selectCountry(list.find((c) => c.isoCode === 'DZ') ?? list[0] ?? this.countries()[0]);
    this.isReady = true;
  }

  /** Country name in the language of the demo (the data itself keeps the English name). */
  countryLabel(country: Country): string {
    return this.lang.countryName(country.isoCode, country.name);
  }

  async onCountryPick(values: string[]): Promise<void> {
    const picked = this.countries().find((c) => String(c.id) === values[0]);
    if (picked && picked.id !== this.country()?.id) {
      await this.selectCountry(picked);
    }
  }

  async onDialogResult({ result }: EasyTableDialogResult<CityRow>): Promise<void> {
    const country = this.country();
    if (isSave(result) && country) {
      await firstValueFrom(this.api.saveCity({ ...toCity(result.data!), countryId: country.id }));
      await this.load();
    }
  }

  async onDelete(item: object): Promise<void> {
    await firstValueFrom(this.api.deleteCity(toCity(item as CityRow)));
    await this.load();
  }

  private async selectCountry(country: Country): Promise<void> {
    this.country.set(country);
    await this.load();
  }

  private async load(): Promise<void> {
    const country = this.country();
    if (!country) return;
    this.cities.set(await firstValueFrom(this.api.getCities(country.id)));
    this.refreshTable();
  }

  private refreshTable(): void {
    const country = this.country();
    if (!country) return;
    this.tableConfig = cityTable({
      data: cityRows(this.cities(), this.display.unit(), this.display.locale(), country.code),
      title: this.translate.instant('pages.CITIES_OF', { name: this.countryLabel(country) }),
      localNames: this.cities().some((c) => !!c.nameAr)
    });
  }
}
