import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {EasyCheckState} from '../../model/easy-table-grouping.model';

@Component({
  selector: 'lib-table-check-mark',
  standalone: true,
  templateUrl: './table-check-mark.html',
  styleUrl: './table-check-mark.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCheckMark {
  @Input() state: EasyCheckState = 'none';
  @Input() disabled = false;
  @Input() readonlyLook = false;
  @Input() label = '';
  @Output() toggled = new EventEmitter<void>();
}
