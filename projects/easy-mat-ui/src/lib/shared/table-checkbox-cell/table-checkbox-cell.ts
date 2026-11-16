import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatColumnTyped} from '../../model/mat-column-typed.model';
import {EasyTableSelectionChange} from '../../model/easy-table-selection.model';
import {isCheckboxEditable} from '../../utils/checkbox-selection';
import {TableCheckMark} from '../table-check-mark/table-check-mark';

@Component({
  selector: 'lib-table-checkbox-cell',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [TableCheckMark],
  templateUrl: './table-checkbox-cell.html'
})
export class TableCheckboxCell {
  @Input({required: true}) column!: MatColumnTyped;
  @Input({required: true}) row: any;
  @Input() tableReadonly = false;
  @Output() selectionChange = new EventEmitter<EasyTableSelectionChange>();

  get checked(): boolean {
    return this.row?.[this.column.name] === true;
  }

  get editable(): boolean {
    return isCheckboxEditable(this.column, this.row, this.tableReadonly);
  }

  get interactive(): boolean {
    return !!this.column.selection?.enabled && !this.column.readonly && !this.tableReadonly;
  }

  toggle(): void {
    if (!this.editable) {
      return;
    }
    const previousValue: boolean | undefined = typeof this.row[this.column.name] === 'boolean' ? this.row[this.column.name] : undefined;
    const value = !this.checked;
    this.row[this.column.name] = value;
    this.selectionChange.emit({field: this.column.name, row: this.row, value, previousValue});
  }
}
