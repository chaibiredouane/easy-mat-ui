export interface EasyTableGroupBy {
  field: string;
  collapsible?: boolean;
  expanded?: boolean;
  selectionField?: string;
  emptyLabel?: string;
  showGroupColumn?: boolean;
  showToggleAll?: boolean;
  expandAllLabel?: string;
  collapseAllLabel?: string;
}

export type EasyCheckState = 'all' | 'some' | 'none';

export interface EasyTableGroupSelectionChange<T = any> {
  field: string;
  groupKey: string;
  groupValue: unknown;
  rows: T[];
  value: boolean;
  previousState: EasyCheckState;
}
