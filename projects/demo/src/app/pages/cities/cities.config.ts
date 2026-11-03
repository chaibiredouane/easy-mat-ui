import { ColumnType, CRUD, EasyDialogInit, EasyTableConfig, EasyTableDialogRequest, MatColumnTyped, ToolbarConfig, ToolbarTranslations } from 'easy-mat-ui-ng20';
import { City, CityRow } from '../../models/geo.model';
import { formatPopulation, PopulationUnit } from '../../shared/population';

const { ColumnSize, InputType } = MatColumnTyped;
const PREFIX = 'cities.';
const t = (key: string) => PREFIX + key;

/** Adds the values that are only there for display. The raw record, `population` included, is untouched. */
export function cityRows(cities: City[], unit: PopulationUnit, locale: string, flag = ''): CityRow[] {
  return cities.map((c) => ({ ...c, flag, populationLabel: formatPopulation(c.population, unit, locale) }));
}

/** Back to the record the service stores. */
export function toCity({ flag, populationLabel, ...city }: CityRow): City {
  return city;
}

// ---- columns ----------------------------------------------------------------
export interface CityColumnsOptions {
  /** Fewer columns: used when the table is a child of another one. */
  compact?: boolean;
  /** Show the administrative code and the Arabic name (only Algeria has them). */
  localNames?: boolean;
}

export function cityColumns({ compact, localNames }: CityColumnsOptions): MatColumnTyped[] {
  const capital = new MatColumnTyped({
    name: 'isCapital',
    translateTitle: t('isCapital'),
    type: ColumnType.ICON,
    size: ColumnSize.Small,
    enableIcon: 'star',
    disableIcon: 'remove',
    conditionFn: (item: CityRow) => item.isCapital,
    cssClassFn: (item: CityRow) => (item.isCapital ? 'yellow' : 'grey')
  });
  const actions = new MatColumnTyped({ name: 'actions', headerIcon: 'rule', stickyClass: 'text-center' });

  if (compact) {
    return [
      new MatColumnTyped({ name: 'name', translateTitle: t('name') }),
      capital,
      new MatColumnTyped({ name: 'populationLabel', translateTitle: t('populationLabel') }),
      actions
    ];
  }
  return [
    new MatColumnTyped({ name: 'flag', type: ColumnType.IMAGE, size: ColumnSize.Small, translateTitle: t('flag') }),
    ...(localNames ? [new MatColumnTyped({ name: 'code', size: ColumnSize.XSmall, translateTitle: t('code') })] : []),
    new MatColumnTyped({ name: 'name', translateTitle: t('name'), enableFilter: true, filterType: 'text' }),
    ...(localNames ? [new MatColumnTyped({ name: 'nameAr', translateTitle: t('nameAr'), cssClass: 'rtl' })] : []),
    capital,
    new MatColumnTyped({ name: 'population', translateTitle: t('population') }),
    new MatColumnTyped({ name: 'populationLabel', translateTitle: t('populationLabel') }),
    actions
  ];
}

// ---- dialog -------------------------------------------------------------------
export function cityDialogFields(): MatColumnTyped[] {
  return [
    new MatColumnTyped({ name: 'name', order: 1, gridSize: 8, isRequired: true }),
    new MatColumnTyped({ name: 'population', order: 2, gridSize: 4, inputType: InputType.Number })
  ];
}

export function cityDialogForm(request: EasyTableDialogRequest<CityRow>): EasyDialogInit<CityRow> {
  const empty = { id: 0, countryId: 0, name: '', population: null, isCapital: false, flag: '', populationLabel: '' };
  return {
    title: 'City',
    titleField: 'name',
    action: request.action,
    data: request.action === CRUD.CREATE ? empty : request.data,
    fields: cityDialogFields(),
    prefix: PREFIX,
    withAuditFields: false
  };
}

// ---- table --------------------------------------------------------------------
export interface CityTableCtx extends CityColumnsOptions {
  data: CityRow[];
  title: string;
  /** No add / edit / delete. */
  readonly?: boolean;
  /** Label of the tab when the table is one of several child tabs. */
  tab?: { title: string; icon: string };
}

export function cityTable(ctx: CityTableCtx): EasyTableConfig<CityRow> {
  const compact = !!ctx.compact;
  const editable = !ctx.readonly;
  return new EasyTableConfig<CityRow>({
    appearance: 'outline',
    withToolbar: true,
    withFilterInHeader: !compact,
    changePageSize: compact ? 5 : 10,
    sortedBy: '', // keep the order given by the service (largest first)
    canCreate: editable,
    canUpdate: editable,
    canDelete: editable,
    prefix: PREFIX,
    tabTitle: ctx.tab?.title,
    tabIcon: ctx.tab?.icon,
    displayedColumns: cityColumns(ctx),
    toolbarConfig: new ToolbarConfig({ icon: 'location_city', translations: new ToolbarTranslations({ title: ctx.title }) }),
    data: ctx.data,
    dialog: editable ? { add: true, edit: true, view: true, mode: 'open', form: cityDialogForm } : undefined
  });
}
