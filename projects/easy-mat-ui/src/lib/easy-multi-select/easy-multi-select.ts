import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {MatFormFieldAppearance, MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {Dictionary} from '../model/dictionary.model';
import {map, Observable, startWith} from 'rxjs';
import {MatOption, MatOptionSelectionChange} from '@angular/material/core';
import {Utils} from '../utils/utils';

@Component({
  selector: 'lib-easy-multi-select',
  host: {'[attr.data-component-id]': "'easy-multi-select-' + componentId", '[class.compact]': 'compact'},
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './easy-multi-select.html',
  styleUrls: ['./easy-multi-select.css', '../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EasyMultiSelect implements OnInit, AfterViewInit {
  componentId = Math.random().toString(36).substring(2);
  @Input() data: Dictionary[] = [];
  @Input() title = 'multi select';
  @Input() valueField!: keyof Dictionary;
  @Input() displayField!: keyof Dictionary;
  @Input() selectedData: Dictionary[] = [];
  @Input() readOnly = false;
  @Input() noPlaceholderNoHint = false;
  @Input() clearable = false;
  @Input() padding = 'pd-0';
  @Input() appearance: MatFormFieldAppearance | null = null;
  @Input() formField = false;
  /** Text shown while nothing is selected. */
  @Input() placeholder = '';
  /** Dense 32px field, used for the column filters in table headers. */
  @Input() compact = false;

  @Output() change = new EventEmitter<string[]>();
  multiSelectControl = new FormControl<string[]>([]);
  searchCtrl = new FormControl<string>('');
  filteredMultiSelect: Observable<Dictionary[]> = new Observable<Dictionary[]>();

  @Input() idPrefix = 'multi-select';
  uniqueId = `${this.idPrefix}-${Math.random().toString(36).substring(2, 9)}`;

  constructor(private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.data = (Utils.getUnique(this.data, this.valueField as string) as Dictionary[]).sort((a, b) =>
      Utils.safeCompare(a[this.displayField], b[this.displayField])
    );
    this.initFilterGroup();

    if (this.selectedData.length > 0) {
      const selectedValues = this.selectedData.map((x) => x[this.valueField] as string);
      this.setMultiSelectControl(selectedValues);
    }

    if (this.readOnly) {
      this.multiSelectControl.disable();
    }
  }

  initFilterGroup(): void {
    this.filteredMultiSelect = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value ?? '', this.data.slice()))
    );
  }

  setMultiSelectControl(values: string[] | null): void {
    this.multiSelectControl.setValue(values);
  }

  private _filter(value: string, options: Dictionary[]): Dictionary[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) => {
      const fieldValue = option[this.displayField];
      const fieldStr = (fieldValue !== null && fieldValue !== undefined) ? String(fieldValue).toLowerCase() : '';
      return fieldStr.includes(filterValue);
    });
  }

  selected(select: MatSelect): 'some' | 'all' | undefined {
    const options = select?.options;
    if (!options) return undefined;

    const total = options.length;
    const selectedCount = options.filter(opt => opt.selected).length;

    if (selectedCount === total) return 'all';
    if (selectedCount > 0) return 'some';
    return undefined;
  }

  toggleSelection(select: MatSelect): void {
    let values = this.multiSelectControl.value ?? [];
    const selection = this.selected(select);

    select.options.forEach((item: MatOption) => {
      if (selection !== 'all' && !values.includes(item.value)) {
        values.push(item.value);
      } else if (selection === 'all' && values.includes(item.value)) {
        values = values.filter((value) => value !== item.value);
      }
    });

    this.setMultiSelectControl(values);
    this.change.emit(values);
  }

  onSelectionChange(event: MatOptionSelectionChange): void {
    let values = this.multiSelectControl.value ?? [];
    if (event.isUserInput) {
      if (event.source.selected && !values.includes(event.source.value)) {
        values.push(event.source.value);
      } else if (!event.source.selected && values.includes(event.source.value)) {
        values = values.filter((value) => value !== event.source.value);
      }
      this.setMultiSelectControl(values);
      this.change.emit(values);
    }
  }

  getTooltips(select: MatSelect): string {
    return this.selected(select) === 'all' ? 'UNSELECT_ALL' : 'SELECT_ALL';
  }

  resetSelection(): void {
    this.multiSelectControl.setValue([]);
    this.searchCtrl.setValue('');
    this.change.emit([]);
  }

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  onKeydown(e: KeyboardEvent, i: HTMLInputElement): void {
    i.onkeydown?.(e);
    e.stopPropagation();
  }

  clear(): void {
    this.searchCtrl.patchValue('');
    this.setMultiSelectControl(null);
  }

  get hidePlaceholder(): boolean {
    const value = this.multiSelectControl.value;
    return Array.isArray(value) && value.length > 0;
  }
}
