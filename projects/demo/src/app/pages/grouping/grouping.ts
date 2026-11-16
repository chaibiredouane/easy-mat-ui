import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { EasyPageHeader, EasyTableComponent, EasyTableConfig, EasyTableGroupSelectionChange, EasyTableSelectionChange } from 'easy-mat-ui';
import { GeoService } from '../../services/geo.service';
import { LanguageService } from '../../services/language.service';
import { CodePanel } from '../../shared/code-panel/code-panel';
import { groupingTable, selectableCountries, SelectableCountry } from './grouping.config';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-grouping',
  imports: [EasyTableComponent, EasyPageHeader, CodePanel, TranslatePipe],
  templateUrl: './grouping.html',
  styleUrl: './grouping.scss'
})
export class Grouping implements OnInit {
  private readonly api = inject(GeoService);
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);
  private rows: SelectableCountry[] = [];

  tableConfig: EasyTableConfig<SelectableCountry> | null = null;
  readonly lastEvent = signal('');
  readonly selectedCount = signal(0);

  constructor() {
    effect(() => {
      this.lang.current();
      untracked(() => this.refreshTable());
    });
  }

  async ngOnInit(): Promise<void> {
    const countries = await firstValueFrom(this.api.getCountries());
    this.rows = selectableCountries(countries);
    this.refreshTable();
    this.refreshCount();
  }

  onSelectionChange(change: EasyTableSelectionChange<SelectableCountry>): void {
    this.lastEvent.set(`${change.row.name}: ${change.previousValue} -> ${change.value}`);
    this.refreshCount();
  }

  onGroupSelectionChange(change: EasyTableGroupSelectionChange<SelectableCountry>): void {
    this.lastEvent.set(`${change.groupKey}: ${change.previousState} -> ${change.value ? 'all' : 'none'} (${change.rows.length})`);
    this.refreshCount();
  }

  private refreshTable(): void {
    if (this.rows.length === 0) return;
    this.rows.forEach((row) => (row.continent = this.translate.instant(`continents.${row.continentId}`)));
    this.tableConfig = groupingTable(this.rows);
  }

  private refreshCount(): void {
    this.selectedCount.set(this.rows.filter((row) => row.selected).length);
  }
}
