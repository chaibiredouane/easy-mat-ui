import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {EasyTableGroupBy} from '../../model/easy-table-grouping.model';

@Component({
  selector: 'lib-table-group-controls',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './table-group-controls.html',
  styleUrl: './table-group-controls.scss'
})
export class TableGroupControls {
  @Input({required: true}) groupBy!: EasyTableGroupBy;
  @Input() allExpanded = false;
  @Input() allCollapsed = false;
  @Output() expandAll = new EventEmitter<void>();
  @Output() collapseAll = new EventEmitter<void>();

  get visible(): boolean {
    return this.groupBy.collapsible !== false && this.groupBy.showToggleAll !== false;
  }
}
