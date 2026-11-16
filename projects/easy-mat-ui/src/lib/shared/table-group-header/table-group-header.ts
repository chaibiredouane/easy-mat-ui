import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {EasyCheckState, EasyTableGroupBy, EasyTableGroupSelectionChange} from '../../model/easy-table-grouping.model';
import {MatColumnTyped} from '../../model/mat-column-typed.model';
import {ColumnType} from '../../utils/enums';
import {aggregateCheckState, countChecked, isCheckboxEditable} from '../../utils/checkbox-selection';
import {TranslatePipe} from '@ngx-translate/core';
import {RowGroup} from '../../utils/row-grouping';
import {TableCheckMark} from '../table-check-mark/table-check-mark';

@Component({
  selector: 'lib-table-group-header',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [TableCheckMark, TranslatePipe],
  templateUrl: './table-group-header.html',
  styleUrl: './table-group-header.scss'
})
export class TableGroupHeader {
  @Input({required: true}) group!: RowGroup;
  @Input({required: true}) groupBy!: EasyTableGroupBy;
  @Input() columns: MatColumnTyped[] = [];
  @Input() tableReadonly = false;
  @Output() toggleGroup = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<EasyTableGroupSelectionChange>();

  get selectionColumn(): MatColumnTyped | undefined {
    return this.groupBy.selectionField
      ? this.columns.find(column => column.name === this.groupBy.selectionField && column.type === ColumnType.Checkbox)
      : undefined;
  }

  get state(): EasyCheckState {
    return this.selectionColumn ? aggregateCheckState(this.group.rows, this.selectionColumn.name) : 'none';
  }

  get checkedCount(): number {
    return this.selectionColumn ? countChecked(this.group.rows, this.selectionColumn.name) : 0;
  }

  get editableRows(): any[] {
    const column = this.selectionColumn;
    return column ? this.group.rows.filter(row => isCheckboxEditable(column, row, this.tableReadonly)) : [];
  }

  toggleSelection(): void {
    const column = this.selectionColumn;
    if (!column || this.editableRows.length === 0) {
      return;
    }
    const previousState = this.state;
    const value = previousState !== 'all';
    const rows = this.editableRows.filter(row => row[column.name] !== value);
    rows.forEach(row => row[column.name] = value);
    if (rows.length > 0) {
      this.selectionChange.emit({
        field: column.name,
        groupKey: this.group.key,
        groupValue: this.group.value,
        rows,
        value,
        previousState
      });
    }
  }
}
