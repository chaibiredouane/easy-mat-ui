import {formatDate} from '@angular/common';
import {Utils} from './utils';
import {ColumnType} from './enums';
import {TitleFormatter, TitleTranslate} from './title-formatter';
import {MatColumnTyped} from '../model/mat-column-typed.model';

export class MatTabCommon {

  static displayFormatTyped(column: MatColumnTyped, value: string | null | undefined): string | null {
    if (value == null) return null;

    switch (column.type) {
      case ColumnType.DATE_TIME:
        return formatDate(value, 'yyyy-MM-dd HH-mm-ss', 'en_LU');
      case ColumnType.DATE:
        return formatDate(value, 'yyyy-MM-dd', 'en_LU');
      case ColumnType.NUMBER:
        const num = parseFloat(value);
        return isNaN(num) ? '' : num.toFixed(2);
      default:
        return value;
    }
  }

  static toFixed(value: string, digits: number): null | string | undefined {
    return value == null ? null : parseFloat(value)?.toFixed(digits);
  }

  static getTitle(col: MatColumnTyped, item: any, translate?: TitleTranslate): string {
    if (col.title) return TitleFormatter.format(col.title, item, col.titleFallback, translate);
    return item?.[col.enableTitle ?? col.name] ?? '';
  }

  static getCssClasses(col: MatColumnTyped, item: any): string {
    const staticClass = col.cssClass ?? '';
    const dynamicClass = col.cssClassFn ? col.cssClassFn(item, col) : '';
    return [staticClass, dynamicClass].filter(Boolean).join(' ');
  }


}
