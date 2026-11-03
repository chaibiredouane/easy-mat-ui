import { ColumnType, CRUD, EasyDialogInit, EasyTableConfig, EasyTableDialogRequest, MatColumnTyped, ToolbarConfig, ToolbarTranslations } from 'easy-mat-ui-ng20';
import { Country } from '../../models/geo.model';

const { ColumnSize } = MatColumnTyped;
const PREFIX = 'countries.';
const t = (key: string) => PREFIX + key;

// ---- columns ----------------------------------------------------------------
export function countryColumns(): MatColumnTyped[] {
  return [
    // An IMAGE column shows a flag from the country code ('dz' -> fi fi-dz).
    new MatColumnTyped({ name: 'code', type: ColumnType.IMAGE, size: ColumnSize.Small, translateTitle: t('code') }),
    new MatColumnTyped({ name: 'name', translateTitle: t('name'), enableFilter: true, filterType: 'text' }),
    new MatColumnTyped({ name: 'isoCode', size: ColumnSize.Small, translateTitle: t('isoCode'), enableFilter: true }),
    new MatColumnTyped({ name: 'dialingCode', size: ColumnSize.Small, translateTitle: t('dialingCode') }),
    new MatColumnTyped({ name: 'capital', translateTitle: t('capital'), enableFilter: true, filterType: 'text' }),
    new MatColumnTyped({ name: 'actions', headerIcon: 'rule', stickyClass: 'text-center' })
  ];
}

// ---- dialog -------------------------------------------------------------------
export function countryDialogFields(): MatColumnTyped[] {
  return [
    new MatColumnTyped({ name: 'name', order: 1, gridSize: 6, isRequired: true }),
    new MatColumnTyped({ name: 'code', order: 2, gridSize: 3, isRequired: true }),
    new MatColumnTyped({ name: 'isoCode', order: 3, gridSize: 3 }),
    new MatColumnTyped({ name: 'dialingCode', order: 4, gridSize: 6 }),
    new MatColumnTyped({ name: 'capital', order: 5, gridSize: 6 })
  ];
}

export function countryDialogForm(request: EasyTableDialogRequest<Country>): EasyDialogInit<Country> {
  const empty: Country = { id: 0, code: '', isoCode: '', name: '', dialingCode: '', capital: '' };
  return {
    title: 'Country',
    titleField: 'name',
    action: request.action,
    data: request.action === CRUD.CREATE ? empty : request.data,
    fields: countryDialogFields(),
    prefix: PREFIX,
    withAuditFields: false
  };
}

// ---- table --------------------------------------------------------------------
export interface CountryTableCtx {
  data: Country[];
  /** Read-only: no add / edit / delete. */
  readonly?: boolean;
}

export function countryTable(ctx: CountryTableCtx): EasyTableConfig<Country> {
  const editable = !ctx.readonly;
  return new EasyTableConfig<Country>({
    appearance: 'outline',
    withToolbar: true,
    withFilterInHeader: true, // column filters: text inputs and multi-select dropdowns
    changePageSize: 10,
    sortedBy: '', // keep the order given by the service: Algeria first, then A to Z
    isExpanded: true, // adds the expand button: the row opens on its child table(s)
    canCreate: editable,
    canUpdate: editable,
    canDelete: editable,
    prefix: PREFIX,
    displayedColumns: countryColumns(),
    toolbarConfig: new ToolbarConfig({ icon: 'public', translations: new ToolbarTranslations({ title: 'Countries' }) }),
    data: ctx.data,
    dialog: editable ? { add: true, edit: true, view: true, mode: 'open', form: countryDialogForm } : undefined
  });
}
