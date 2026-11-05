import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EasyCardConfig, EasyCardGrid } from 'easy-mat-ui-ng20';
import { LanguageService } from '../../services/language.service';
import { GithubMark } from '../../shared/github-mark/github-mark';
import { LINKS } from '../../shared/links';

/**
 * Presentation page. Every text is a key of the dictionaries (`overview.*`), so the page follows the
 * language of the demo. Only code samples and package names stay as they are.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-overview',
  imports: [MatIconModule, TranslatePipe, GithubMark, EasyCardGrid],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  /** Asks the shell to open another page. */
  readonly open = output<string>();

  readonly links = LINKS;
  readonly copied = signal(false);

  /** `page` is the demo page that shows the feature, when there is one. */
  readonly features = [
    { id: 'table', icon: 'table_chart', page: 'cities' },
    { id: 'filters', icon: 'filter_alt', page: 'cities' },
    { id: 'paging', icon: 'swap_vert', page: 'cities' },
    { id: 'child', icon: 'account_tree', page: 'tabs' },
    { id: 'dialog', icon: 'edit_note', page: 'cities' },
    { id: 'multi', icon: 'checklist', page: 'countries' },
    { id: 'themes', icon: 'contrast', page: null },
    { id: 'i18n', icon: 'translate', page: null },
    { id: 'a11y', icon: 'accessibility_new', page: null }
  ] as const;

  readonly steps = [
    { id: 'describe', icon: 'tune' },
    { id: 'drop', icon: 'widgets' },
    { id: 'done', icon: 'bolt' }
  ] as const;

  readonly ways = [
    { id: 'bug', icon: 'bug_report' },
    { id: 'idea', icon: 'lightbulb' },
    { id: 'lang', icon: 'translate' },
    { id: 'code', icon: 'merge_type' }
  ] as const;

  readonly flow = ['fork', 'branch', 'pr'] as const;

  // The two grids below are lib-easy-card-grid of easy-mat-ui: the demo only gives it the texts of its dictionaries.
  readonly featureCards = computed<EasyCardConfig[]>(() => {
    this.lang.current(); // the texts change with the language
    const t = (key: string) => this.translate.instant(key);
    return this.features.map((feature) => ({
      id: feature.id,
      icon: feature.icon,
      title: t(`overview.features.${feature.id}.t`),
      description: t(`overview.features.${feature.id}.d`),
      clickable: !!feature.page,
      cta: feature.page ? t('overview.TRY') : undefined
    }));
  });

  readonly wayCards = computed<EasyCardConfig[]>(() => {
    this.lang.current();
    return this.ways.map((way) => ({
      id: way.id,
      icon: way.icon,
      title: this.translate.instant(`overview.ways.${way.id}.t`),
      description: this.translate.instant(`overview.ways.${way.id}.d`)
    }));
  });

  /** A card that leads to a demo page was used: open that page. */
  onFeature(card: EasyCardConfig): void {
    const page = this.features.find((feature) => feature.id === card.id)?.page;
    if (page) this.open.emit(page);
  }

  readonly installCommand = 'npm install easy-mat-ui-ng20';

  readonly config = [
    'export const countryTable = (data: Country[]) =>',
    '  new EasyTableConfig<Country>({',
    '    data,',
    '    displayedColumns: [',
    "      new MatColumnTyped({ name: 'name' }),",
    "      new MatColumnTyped({ name: 'capital' }),",
    '    ],',
    '    canCreate: true, canUpdate: true, canDelete: true,',
    "    dialog: { add: true, edit: true, view: true, mode: 'open', form: countryDialogForm },",
    '  });'
  ].join('\n');

  readonly template = '<lib-easy-table [config]="tableConfig" (dialogResult)="onDialogResult($event)" />';

  /** `note` is a key under `overview.compat`. */
  readonly compatibility = [
    { angular: '20', status: 'ok', note: 'note20' },
    { angular: '19, 21', status: 'warn', note: 'note1921' },
    { angular: '18', status: 'no', note: 'note18' },
    { angular: '16, 17', status: 'no', note: 'note1617' }
  ] as const;

  async copyInstall(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCommand);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context): the command remains selectable */
    }
  }
}
