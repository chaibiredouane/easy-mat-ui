import { ColumnType, EasyTableConfig, MatColumnTyped, ToolbarConfig, ToolbarTranslations } from 'easy-mat-ui';
import { continentOf } from '../../data/continents';
import { Country } from '../../models/geo.model';

const { ColumnSize } = MatColumnTyped;
const PREFIX = 'grouping.';
const t = (key: string) => PREFIX + key;

export interface SelectableCountry extends Country {
  continent: string;
  continentId: string;
  selected: boolean;
}

export function selectableCountries(countries: Country[]): SelectableCountry[] {
  return countries.map((country) => ({
    ...country,
    continent: '',
    continentId: continentOf(country.isoCode) ?? 'other',
    selected: country.isoCode === 'DZ'
  }));
}

export function groupingColumns(): MatColumnTyped[] {
  return [
    new MatColumnTyped({
      name: 'selected',
      type: ColumnType.Checkbox,
      size: ColumnSize.Small,
      translateTitle: t('selected'),
      selection: { enabled: true, headerAlign: 'center' }
    }),
    new MatColumnTyped({ name: 'continent', translateTitle: t('continent') }),
    new MatColumnTyped({ name: 'code', type: ColumnType.IMAGE, size: ColumnSize.Small, translateTitle: t('code'), headerClass: 'text-center' }),
    new MatColumnTyped({ name: 'name', translateTitle: t('name'), enableFilter: true, filterType: 'text' }),
    new MatColumnTyped({ name: 'capital', translateTitle: t('capital') })
  ];
}

export function groupingTable(data: SelectableCountry[]): EasyTableConfig<SelectableCountry> {
  return new EasyTableConfig<SelectableCountry>({
    appearance: 'outline',
    withToolbar: true,
    changePageSize: 25,
    sortedBy: 'name',
    readonly: false,
    prefix: PREFIX,
    displayedColumns: groupingColumns(),
    groupBy: {
      field: 'continent',
      collapsible: true,
      expanded: false,
      selectionField: 'selected',
      showToggleAll: true,
      expandAllLabel: t('EXPAND_ALL'),
      collapseAllLabel: t('COLLAPSE_ALL')
    },
    toolbarConfig: new ToolbarConfig({ icon: 'groups', translations: new ToolbarTranslations({ title: t('TITLE') }) }),
    data
  });
}
