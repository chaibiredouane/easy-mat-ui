import {MatColumnTyped} from '../model/mat-column-typed.model';
import {EasyCheckState} from '../model/easy-table-grouping.model';

export function isCheckboxEditable(column: MatColumnTyped, row: any, tableReadonly: boolean): boolean {
  return !!column.selection?.enabled && !column.readonly && !tableReadonly && !column.selection.disabledFn?.(row);
}

export function countChecked(rows: any[], field: string): number {
  return rows.filter(row => row?.[field] === true).length;
}

export function aggregateCheckState(rows: any[], field: string): EasyCheckState {
  const checkedCount = countChecked(rows, field);
  if (checkedCount === 0) {
    return 'none';
  }
  return checkedCount === rows.length ? 'all' : 'some';
}
