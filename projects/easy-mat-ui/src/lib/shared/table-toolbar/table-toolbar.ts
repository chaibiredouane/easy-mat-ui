import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Dictionary} from '../../model/dictionary.model';
import {TranslatePipe} from '@ngx-translate/core';
import {MatColumn} from '../../model/mat-column.model';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {CommonModule, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ToolbarConfig} from '../../model/toolbar-config.model';

@Component({
  selector: 'lib-table-toolbar',
  standalone: true,
  imports: [
    MatButtonToggle,
    TranslatePipe,
    MatInput,
    MatFormField,
    MatIconButton,
    MatIcon,
    MatButtonToggleGroup,
    NgClass,
    FormsModule,
    CommonModule,
    MatFormFieldModule
  ],
  templateUrl: './table-toolbar.html',
  styleUrls: ['./table-toolbar.css', '../../styles.scss'],
})
export class TableToolbarComponent {
  @Input() config: ToolbarConfig = new ToolbarConfig();

  @Input() isPreview = false;
  @Input() searchTableField = '';
  @Input() readonly = false;
  @Input() canCreate = true;
  @Input() canExport = true;
  @Input() showFilterOperator = true;
  @Input() customColumnFilter: Dictionary[] = [];

  @Output() searchTableFieldChange = new EventEmitter<string>();
  @Output() applyFilterEvent = new EventEmitter<KeyboardEvent>();
  @Output() filterTypeEvent = new EventEmitter<void>();
  @Output() clearTableFilterEvent = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<void>();
  @Output() exportToCsv = new EventEmitter<void>();
  @Output() customAction = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() toggleChanged = new EventEmitter<any>();

  filterColumn!: MatColumn;

  onSearchChange(value: string) {
    this.searchTableFieldChange.emit(value);
  }

  applyFilter(event: KeyboardEvent) {
    this.applyFilterEvent.emit(event);
  }

  filterType() {
    this.filterTypeEvent.emit();
  }

  clearTableFilter() {
    this.searchTableField = '';
    this.clearTableFilterEvent.emit();
  }

  onAddItem() {
    this.addItem.emit();
  }

  onExportToCsv() {
    this.exportToCsv.emit();
  }

  onCustomAction() {
    this.customAction.emit();
  }

  onClose() {
    this.close.emit();
  }

  onToggleChanged(value: any) {
    this.toggleChanged.emit(value);
  }

  getTitleFilterOperator() {
    return this.config.isAndFilterOperator ? 'FILTER_BY_AND_OPERATOR' : 'FILTER_BY_OR_OPERATOR';
  }

  getIconFilterOperator() {
    return this.config.isAndFilterOperator ? 'zoom_out' : 'zoom_in';
  }

  getFilterColor(filter: Dictionary): string | undefined {
    const filterValue = String(filter.value).toLowerCase();
    const filterKey = String(filter.key).toLowerCase();

    switch (filterValue) {
      case 'true':
        return filterKey === 'true'
          ? this.filterColumn.enableColor
          : this.filterColumn.disableColor;
      case 'false':
        return 'grey';
      default:
        return 'black';
    }
  }

  getFilterIcon(filter: Dictionary) {
    return String(filter.key) === 'true' ? this.filterColumn.enableIcon : this.filterColumn.disableIcon;
  }
}
