import {Tuple} from './tuple.model';
import {ColumnSize, ColumnType, InputType} from '../utils/enums';

/** How a column is filtered from the table header: a multi-select of its values, or a free text input. */
export type ColumnFilterType = 'select' | 'text';

export class MatColumnTyped {
  static readonly ColumnType = {
    ICON: 'icon',
    TEXT: 'text',
    DATE: 'date',
    DATE_TIME: 'date-time',
    NUMBER: 'number',
    FILTER: 'filter',
    ICON_AND_TEXT: 'icon-and-text',
    PASSWORD: 'password',
    BUTTON: 'button',
    DROPDOWNLIST: 'dropdownlist',
    IMAGE: 'image'
  } as const;

  static readonly ColumnSize = {
    XSmall: 'x-small-column',
    Small: 'small-column',
    Medium: 'medium-column',
    Large: 'large-column',
    XLarge: 'x-large-column'
  } as const;

  static readonly InputType = {
    Dropdown: 'ddl',
    MultiSelect: 'multiselect',
    Text: 'text',
    Number: 'number',
    Date: 'date',
    TextArea: 'textarea',
    Checkbox: 'checkbox'
  } as const;

  name: string = '';
  value: string | null = null;
  type?: ColumnType | string = ColumnType.TEXT;
  enableIcon = 'thumb_up';
  disableIcon = 'thumb_down';
  enableColor = 'green';
  disableColor = 'red';
  enableTitle: string | null = null;
  disableTitle: string | null = null;
  enableTitleFromColumnName: string | null = null;
  disableTitleFromColumnName: string | null = null;
  mixColumnIconColor: Tuple[] = [];
  enableFilter = false;
  /** Kind of header filter shown when `enableFilter` is on (and `withFilterInHeader` for the table). */
  filterType: ColumnFilterType = 'select';
  filterList: any[] = [];
  isOverwriting = false;
  readonly = false;
  stickyClass = '';
  isDynamic = false;
  displayColumn: string | null = null;
  filterValue: string | null = null;
  isRequired = false;
  id = 'id';
  size?: ColumnSize | string = ColumnSize.Medium;
  gridSize = 6;
  inputType?: InputType | string = InputType.Text;
  order = 0;
  compareFn?: (o1: any, o2: any) => boolean;
  cssClass?: string = '';
  cssClassFn?: (item: any, col: MatColumnTyped) => string;
  conditionFn?: (item: any, col?: MatColumnTyped) => boolean;
  groupName: string = '';
  groupClass: string = '';
  groupLabel: string = '';
  groupOrder: number | null = null;
  translateTitle?: string | null = null;
  title?: string | null = null;
  titleFallback?: string | null = null;
  headerIcon?: string | null = null;

  constructor(init?: Partial<MatColumnTyped>) {
    Object.assign(this, init);
  }

  static allColumnTypes(): string[] {
    return Object.values(MatColumnTyped.ColumnType);
  }

  static allColumnSizes(): string[] {
    return Object.values(MatColumnTyped.ColumnSize);
  }

  static allInputTypes(): string[] {
    return Object.values(MatColumnTyped.InputType);
  }
}
