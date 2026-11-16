import {MatTableDataSource} from '@angular/material/table';
import {EasyTableGroupBy} from '../model/easy-table-grouping.model';

export interface RowGroup {
  key: string;
  value: unknown;
  label: string;
  rows: any[];
  expanded: boolean;
  collapsible: boolean;
}

export interface RowGroupHeader {
  __rowGroup: RowGroup;
}

export const isGroupHeader = (row: any): row is RowGroupHeader => !!row?.__rowGroup;

export const isGroupRow = (_index: number, row: any): boolean => isGroupHeader(row);

export const isDataRow = (_index: number, row: any): boolean => !isGroupHeader(row);

export const isGroupColumnHidden = (groupBy: EasyTableGroupBy | undefined, columnName: string): boolean =>
  !!groupBy?.field && groupBy.field === columnName && !groupBy.showGroupColumn;

const EMPTY_GROUP_LABEL = '—';

export class RowGroupingState {
  private readonly overrides = new Map<string, boolean>();

  isExpanded(key: string, groupBy: EasyTableGroupBy): boolean {
    if (groupBy.collapsible === false) {
      return true;
    }
    return this.overrides.get(key) ?? groupBy.expanded ?? true;
  }

  setAll(keys: string[], expanded: boolean): void {
    keys.forEach(key => this.overrides.set(key, expanded));
  }

  toggle(key: string, groupBy: EasyTableGroupBy): void {
    this.overrides.set(key, !this.isExpanded(key, groupBy));
  }
}

function toGroupKey(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

export interface GroupExpansion {
  allExpanded: boolean;
  allCollapsed: boolean;
}

export function listGroupKeys(rows: any[] | null | undefined, groupBy: EasyTableGroupBy | undefined): string[] {
  return groupBy?.field ? [...new Set((rows ?? []).map(row => toGroupKey(row?.[groupBy.field])))] : [];
}

export function summarizeGroupExpansion(displayedRows: any[] | null | undefined): GroupExpansion {
  const groups = (displayedRows ?? []).filter(isGroupHeader).map(header => header.__rowGroup);
  return {
    allExpanded: groups.every(group => group.expanded),
    allCollapsed: groups.every(group => !group.expanded)
  };
}

export function buildGroupedRows(rows: any[], groupBy: EasyTableGroupBy | undefined, state: RowGroupingState): any[] {
  if (!groupBy?.field) {
    return rows;
  }
  const groups = new Map<string, RowGroup>();
  for (const row of rows) {
    const key = toGroupKey(row?.[groupBy.field]);
    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        value: row?.[groupBy.field],
        label: key === '' ? (groupBy.emptyLabel ?? EMPTY_GROUP_LABEL) : key,
        rows: [],
        expanded: state.isExpanded(key, groupBy),
        collapsible: groupBy.collapsible !== false
      };
      groups.set(key, group);
    }
    group.rows.push(row);
  }
  return [...groups.values()].flatMap(group => [{__rowGroup: group}, ...(group.expanded ? group.rows : [])]);
}

function sortWithinGroups(data: any[], sortChildren: (rows: any[]) => any[]): any[] {
  const result: any[] = [];
  let segment: any[] = [];
  const flushSegment = () => {
    result.push(...sortChildren(segment));
    segment = [];
  };
  for (const item of data) {
    if (isGroupHeader(item)) {
      flushSegment();
      result.push(item);
    } else {
      segment.push(item);
    }
  }
  flushSegment();
  return result;
}

export class RowGroupDataSource extends MatTableDataSource<any> {
  constructor(rows: any[]) {
    super(rows);
    let rowPredicate = this.filterPredicate;
    Object.defineProperty(this, 'filterPredicate', {
      configurable: true,
      get: () => (data: any, filter: string) =>
        isGroupHeader(data) ? data.__rowGroup.rows.some(row => rowPredicate(row, filter)) : rowPredicate(data, filter),
      set: (predicate: (data: any, filter: string) => boolean) => {
        rowPredicate = predicate;
      }
    });
    const rowSort = this.sortData;
    this.sortData = (data, sort) => sortWithinGroups(data, rows => rowSort(rows, sort));
  }
}

export function createRowDataSource(rows: any[], groupBy: EasyTableGroupBy | undefined): MatTableDataSource<any> {
  return groupBy?.field ? new RowGroupDataSource(rows) : new MatTableDataSource<any>(rows);
}
