import {ColumnType} from '../utils/enums';
import {Tuple} from './tuple.model';

export class MatColumn {
  name: string;
  value: string | null = null;
  type: ColumnType = ColumnType.ICON;

  enableIcon: string = 'thumb_up';
  disableIcon: string = 'thumb_down';

  enableColor: string = 'green';
  disableColor: string = 'red';

  enableTitle?: string;
  disableTitle?: string;

  enableTitleFromColumnName?: string;
  disableTitleFromColumnName?: string;

  mixColumnIconColor: Tuple[] = [];

  enableFilter: boolean = false;

  filterList: Array<any | Tuple | unknown> = [];

  filterDisplayColumn?: string;

  constructor(name: string, options?: Partial<Omit<MatColumn, 'name' | 'constructor'>>) {
    this.name = name;
    if (options) {
      Object.assign(this, options);
    }
  }
}
