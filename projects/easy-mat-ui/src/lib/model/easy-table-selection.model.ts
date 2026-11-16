export type EasyColumnAlign = 'left' | 'center' | 'right';

export interface EasyColumnSelection {
  enabled?: boolean;
  headerAlign?: EasyColumnAlign;
  disabledFn?: (row: any) => boolean;
}

export interface EasyTableSelectionChange<T = any> {
  field: string;
  row: T;
  value: boolean;
  previousValue: boolean | undefined;
}
