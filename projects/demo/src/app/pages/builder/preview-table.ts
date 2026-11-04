import { ColumnType, EasyTableConfig, MatColumnTyped, ToolbarConfig, ToolbarTranslations } from 'easy-mat-ui-ng20';
import { sampleRecords, TableBlock } from '@easy-mat-ui/page-generator';

/**
 * The table of the preview: the same columns as the generated code (text, icon for a yes / no, date, then the actions),
 * built at run time instead of being written in a file. See `tools/page-generator/src/table.ts` for the code it mirrors.
 */
export function previewTable(block: TableBlock): EasyTableConfig<Record<string, unknown>> {
  const model = block.model;
  const key = model.fields.find((f) => f.name === 'id') ?? model.fields[0];
  const shown = model.fields.filter((field) => field.name !== key.name);
  const filters = block.filters !== false;
  let filtered = 0;

  const columns = shown.map((field) => {
    const name = field.name;
    const translateTitle = name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^is /i, '').replace(/^./, (c) => c.toUpperCase());
    if (field.type === 'boolean') {
      return new MatColumnTyped({
        name,
        translateTitle,
        type: ColumnType.ICON,
        enableIcon: 'check_circle',
        disableIcon: 'cancel',
        stickyClass: 'text-center',
        conditionFn: (item: Record<string, unknown>) => !!item[name],
        cssClassFn: (item: Record<string, unknown>) => (item[name] ? 'text-success' : 'text-danger')
      });
    }
    const column = new MatColumnTyped({ name, translateTitle, ...(field.type === 'date' ? { type: ColumnType.DATE } : {}) });
    if (filters && field.type === 'string' && filtered < 2) {
      column.enableFilter = true;
      column.filterType = 'text';
      filtered++;
    }
    return column;
  });
  columns.push(new MatColumnTyped({ name: 'actions', headerIcon: 'rule', stickyClass: 'text-center' }));

  return new EasyTableConfig<Record<string, unknown>>({
    appearance: 'outline',
    withToolbar: true,
    withFilterInHeader: filters,
    changePageSize: 5,
    sortedBy: '',
    canCreate: block.canCreate !== false,
    canUpdate: block.canUpdate !== false,
    canDelete: block.canDelete !== false,
    displayedColumns: columns,
    toolbarConfig: new ToolbarConfig({ icon: block.icon ?? 'grid_view', translations: new ToolbarTranslations({ title: block.title }) }),
    data: sampleRecords(model, 6)
  });
}
