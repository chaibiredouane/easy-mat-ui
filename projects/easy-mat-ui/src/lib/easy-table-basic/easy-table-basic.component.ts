import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ColumnType, CRUD} from '../utils/enums';
import {Dictionary} from '../model/dictionary.model';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableToolbarComponent} from '../shared/table-toolbar/table-toolbar';
import {MatColumnTyped} from '../model/mat-column-typed.model';
import {MatTabCommon} from '../utils/matTabCommon';
import {MatSelectModule} from '@angular/material/select';
import {EasyMultiSelect} from '../easy-multi-select/easy-multi-select';
import {EasyTableConfig} from '../model/easy-table-config.model';
import {EasyTableDialogRequest, EasyTableDialogResult} from '../model/easy-table-dialog.model';
import {triggerTableDialog} from '../shared/table-dialog/table-dialog';
import {confirmDelete} from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'lib-easy-table-basic',
  imports: [
    CommonModule,
    TranslatePipe,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,
    TableToolbarComponent,
    EasyMultiSelect
  ],
  templateUrl: './easy-table-basic.component.html',
  styleUrls: ['../easy-table/easy-table.component.css', '../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyTableBasicComponent<T extends Record<string, any>> implements OnInit, AfterViewInit, OnChanges {
  @Input() dataSource!: MatTableDataSource<T>;

  private _displayedColumns: MatColumnTyped[] = [];
  public availableGroups: string[] = [];

  @Input()
  set displayedColumns(value: (string | MatColumnTyped)[]) {
    if (!value) {
      this._displayedColumns = [];
      this.availableGroups = [];
      return;
    }

    const mappedColumns = value.map((col) => {
      if (typeof col === 'string') {
        return new MatColumnTyped({name: col, value: col, order: 0});
      } else {
        return new MatColumnTyped({
          ...col,
          order: col.order ?? 0,
        });
      }
    });

    const grouped = mappedColumns.filter(col => !!col.groupName);
    const ungrouped = mappedColumns.filter(col => !col.groupName);

    const groupedByGroupName = new Map<string, MatColumnTyped[]>();

    grouped.forEach(col => {
      const group = col.groupName!;
      if (!groupedByGroupName.has(group)) {
        groupedByGroupName.set(group, []);
      }
      groupedByGroupName.get(group)!.push(col);
    });

    if (ungrouped.length) {
      groupedByGroupName.set('_ungrouped', ungrouped);
    }

    const sortedGroups = [...groupedByGroupName.entries()].sort((a, b) => {
      const aOrder = a[1][0].order ?? 0;
      const bOrder = b[1][0].order ?? 0;
      return aOrder - bOrder;
    });

    const finalSorted: MatColumnTyped[] = [];
    sortedGroups.forEach(([_, cols]) => {
      const sortedCols = cols.sort((a, b) => a.order - b.order);
      finalSorted.push(...sortedCols);
    });

    this._displayedColumns = finalSorted;
    this.availableGroups = this.groupedColumns.map(([groupName, _]) => groupName);
  }

  /** True when at least one column has a header filter: every header cell then reserves the same filter row. */
  get hasColumnFilters(): boolean {
    return this._displayedColumns.some(c => c.enableFilter);
  }

  get displayedColumns(): MatColumnTyped[] {
    return this._displayedColumns;
  }

  private _config: EasyTableConfig<T> = new EasyTableConfig<T>();

  @Input()
  set config(value: Partial<EasyTableConfig<T>>) {
    this._config = new EasyTableConfig<T>(value);
    Object.assign(this, this._config);
    if (this._config.displayedColumns) {
      this.displayedColumns = this._config.displayedColumns;
    }
    if (this._config.dataSource) {
      this.dataSource = this._config.dataSource;
    }
  }

  get config(): EasyTableConfig<T> {
    return this._config;
  }

  @Output() deleteItem = new EventEmitter<object>();
  @Output() addItem = new EventEmitter<CRUD>();
  @Output() editItem = new EventEmitter<object>();
  @Output() viewItem = new EventEmitter<object>();
  @Output() overwrite = new EventEmitter<{ source: string; value: string; item: object }>();
  @Output() logout = new EventEmitter<String>();
  @Output() titleIconClick = new EventEmitter<void>();
  @Output() customAction = new EventEmitter<void>();
  @Output() auditTrail = new EventEmitter<object>();
  @Output() dialogAction = new EventEmitter<EasyTableDialogRequest>();
  @Output() dialogResult = new EventEmitter<EasyTableDialogResult>();
  @Output() clickField = new EventEmitter<{ columnName: string; row: T }>();

  searchTableField = '';
  /**
   * Text the table filters on. It is kept apart from `searchTableField`, the value bound to the toolbar input:
   * typing never pushes a value back into the input, so a delayed change detection cannot overwrite what the
   * user has typed since.
   */
  searchText = '';
  isAndFilterOperator = true;
  ColumnType: typeof ColumnType = ColumnType;
  columnFilters: { [key: string]: string } = {};
  /** What the user typed in the text filters, as typed (the filter itself is normalized). */
  columnFilterText: { [key: string]: string | undefined } = {};
  /** Header filters are always visible on wide screens; below 1024px this toggles them. */
  filtersOpen = false;
  isPasswordVisible: Record<string, boolean> = {};
  protected readonly MatTabCommon = MatTabCommon;
  expandedGroups: { [key: string]: boolean } = {};
  selectedRow: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable, {static: true}) table: MatTable<any> | undefined;
  @ViewChildren('multiSelectDropdown') multiSelectDropdowns!: QueryList<EasyMultiSelect>;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  constructor() {
  }

  ngOnInit() {
    if (this.config.prefix && !this.config.prefix.endsWith('.')) {
      this.config.prefix = this.config.prefix + '.';
    }
    this.loadData();
    this.groupedColumns.forEach(([groupName]) => {
      this.expandedGroups[groupName] = true;
    });
  }

  getTableMinWidth(): number {
    const names = this.getDisplayedColumnNames();
    const others = names.filter(n => n !== 'actions' && n !== '#' && n !== 'expandedDetail').length;
    return others * 130 + (names.includes('actions') ? 132 : 0) + (names.includes('#') ? 60 : 0);
  }

  getDisplayedColumnNames(): string[] {
    const cols: string[] = [];
    this.groupedColumns.forEach(([groupName, columns]) => {
      if (groupName === '_ungrouped' || this.expandedGroups[groupName]) {
        columns.forEach(col => cols.push(col.name));
      }
    });
    return cols;
  }

  get groupedColumns(): [string, MatColumnTyped[]][] {
    const groupedMap = new Map<string, MatColumnTyped[]>();

    this._displayedColumns.forEach(col => {
      const key = col.groupName || '_ungrouped';
      if (!groupedMap.has(key)) groupedMap.set(key, []);
      groupedMap.get(key)!.push(col);
    });

    const result = Array.from(groupedMap.entries())
      .map(([groupName, columns]) => {
        const groupOrder = columns[0]?.groupOrder != null ? columns[0].groupOrder.toString() : '';
        return {groupName, columns, order: groupOrder};
      })
      .sort((a, b) => {
        if (a.groupName === '_ungrouped') return -1;
        if (b.groupName === '_ungrouped') return 1;
        return a.order.localeCompare(b.order);
      });

    return result.map(r => [r.groupName, r.columns]);
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    if (this.config.sortedBy) {
      this.config.data.sort((x, y) => {
        const valX = String(x[this.config.sortedBy] ?? '');
        const valY = String(y[this.config.sortedBy] ?? '');
        return valX.localeCompare(valY);
      });
    }
    this.dataSource = new MatTableDataSource<any>(this.config.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.searchText;
    this.updatePageSize();
    this.syncFiltersWithData();
  }

  syncFiltersWithData(): void {
    if (!this.config.data?.length) return;

    this.displayedColumns.forEach(column => {
      if (!column.enableFilter) return;

      const field = column.name;
      const displayField = column.displayColumn ?? column.name;

      const dataValues = this.config.data
        .map(item => item[field])
        .filter(val => val != null);

      const uniqueValues = Array.from(new Set(dataValues));

      if (!column.filterList || column.filterList.length === 0) {
        column.filterList = uniqueValues.map(val => ({
          value: val,
          [displayField]: val
        }));
      } else {
        const valueSet = new Set(uniqueValues);
        column.filterList = column.filterList.filter(obj => valueSet.has(obj[displayField]));
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.updatePageSize();
  }

  updatePageSize(): void {
    if (this.config.changePageSize != null && this.dataSource.paginator) {
      this.dataSource.paginator.pageSize = this.config.changePageSize;
      this.dataSource.paginator._changePageSize(this.config.changePageSize);
    }
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';
    this.searchText = value.trim().toLowerCase();
    this.setFilters();
    this.applyCustomFilter();
  }

  clearTableFilter() {
    this.searchTableField = '';
    this.searchText = '';
    this.columnFilters = {};
    this.columnFilterText = {};
    this.setFilters();
    this.dataSource.filter = '';
    this.resetDropdownSelection();
  }

  resetDropdownSelection() {
    this.multiSelectDropdowns.forEach((dropdown) => {
      dropdown.resetSelection();
    });
  }

  filterType() {
    this.searchTableField = '';
    this.searchText = '';
    this.dataSource.filter = '';
    this.isAndFilterOperator = !this.isAndFilterOperator;
  }

  onDeleteItem(item: object): void {
    this.manageSelectedRow(item);
    if (!this.config.confirmDelete) {
      this.deleteItem.emit(item);
      return;
    }
    confirmDelete(this.injector, this.config.toolbarConfig.translations)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.deleteItem.emit(item);
        }
      });
  }

  onAddItem(): void {
    if (!this.requestDialog(CRUD.CREATE, {})) {
      this.addItem.emit(CRUD.CREATE);
    }
  }

  onEditItem(item: object): void {
    if (!this.requestDialog(CRUD.UPDATE, item)) {
      this.editItem.emit(item);
    }
    this.manageSelectedRow(item);
  }

  onViewItem(item: object): void {
    if (!this.requestDialog(CRUD.READ, item)) {
      this.viewItem.emit(item);
    }
    this.manageSelectedRow(item);
  }

  private requestDialog(action: CRUD, data: object): boolean {
    return triggerTableDialog({
      config: this.config.dialog,
      action,
      data,
      injector: this.injector,
      destroyRef: this.destroyRef,
      onRequest: request => this.dialogAction.emit(request),
      onResult: event => this.dialogResult.emit(event)
    });
  }

  onFieldClick(col: MatColumnTyped, row: T): void {
    if (this.config.withFieldClick) {
      this.clickField.emit({columnName: col.name, row});
    }
  }

  onOverwrite(element: any, col: MatColumnTyped, event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.config.data.find(x => x[col.id] === element[col.id])[col.name] = input?.value ?? '';
    this.dataSource = new MatTableDataSource<any>(this.config.data);
    this.overwrite.emit({source: col.name, value: input?.value ?? element[col.name], item: element});
  }

  onLogout() {
    this.logout.emit('CLOSE');
  }

  onCustomAction() {
    if (this.config.customActionEnable) {
      this.customAction.emit();
    }
  }

  getIconColumn(col: MatColumnTyped, item: any): string {
    return col.isDynamic ? item[col.name] : (col.conditionFn && col.conditionFn(item, col)) ? col.enableIcon : col.disableIcon;
  }

  getIconTitle(col: MatColumnTyped, value: string): string {
    return col.isDynamic ? value : (value === 'true'
      ? col.enableTitle || col.disableTitle || ''
      : col.disableTitle || '');
  }

  getTitleColumn(col: MatColumnTyped, item: any): string {
    return MatTabCommon.getTitle(col, item, key => this.translate.instant(key));
  }

  exportToCsv() {
    console.log('Export File');
  }

  getHeaderName(columnName: string) {
    return this.config.prefix + columnName;
  }

  OnToggleChanged(values: Dictionary[]) {
    this.setStatusColor(values);
    const _data: any[] = [];
    if (values.length > 0) {
      values.forEach(filter => {
        // @ts-ignore
        _data.push(...this.config.data?.filter(x => filter.key == x[this.config.filterColumn.name]));
      });
    }
    this.getData(_data);
  }

  setStatusColor(values: Dictionary[]) {
    this.config.customColumnFilter.forEach(x => x.value = 'false');
    values.forEach(x => x.value = 'true');
  }

  getData(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.searchText;
  }

  onAuditTrail(item: object) {
    if (this.config.canAuditTrail) {
      this.auditTrail.emit(item);
    }
  }

  applyFilterFromToolbar() {
    this.searchText = this.searchTableField.trim().toLowerCase();
    this.dataSource.filter = this.searchText;
  }

  async onChangeDdl(element: any, col: MatColumnTyped, value: any) {
    this.config.data.find(x => x[col.id] === element[col.id])[col.name] = value;
    this.dataSource = new MatTableDataSource<any>(this.config.data);
    this.overwrite.emit({source: col.name, value: value[col.name], item: element});
  }

  onChangeMultiSelect(selected: any, col: MatColumnTyped, headerFilter: boolean = true) {
    if (headerFilter) {
      const list = col.filterList?.filter(x => selected.includes(x[col.displayColumn ?? col.name]));
      this.applyFilterByColumn(list.map(x => x[col.displayColumn ?? col.name]).join('+'), col);
    } else {
      console.log(JSON.stringify(selected));
    }
  }

  onColumnTextFilter(value: string, column: MatColumnTyped): void {
    this.columnFilterText[column.name] = value;
    this.applyFilterByColumn(value, column);
  }

  applyFilterByColumn(filterValue: string, column: MatColumnTyped): void {
    this.columnFilters[column.name] = filterValue.trim().toLowerCase();
    this.setFilters();
    this.applyCustomFilter();
  }

  getSelectedData(element: any, col: MatColumnTyped) {
    const selectedData: Dictionary[] = [];
    selectedData.push(new Dictionary(element[col.displayColumn ?? col.name], element[col.name]));
    return selectedData;
  }

  getSelectedList(col: MatColumnTyped) {
    const key = col.displayColumn ?? col.name;
    const selected = this.columnFilters[key]?.split('+') ?? [];

    return col.filterList?.filter(item => {
      const value = item?.[key];
      if (value == null) return false;
      return selected.includes(String(value).toLowerCase());
    }) || [];
  }

  applyCustomFilter(): void {
    this.dataSource.filterPredicate = (data: Record<string, any>, filter: string): boolean => {
      let parsedFilter: { global?: string; columns?: Record<string, string> } = {};

      try {
        parsedFilter = JSON.parse(filter || '{}');
      } catch (e) {
        parsedFilter = {global: filter};
      }

      const globalFilter = (parsedFilter.global ?? '').toLowerCase().trim();
      const columnFilters = parsedFilter.columns ?? {};

      if (globalFilter) {
        const globalKeywords = globalFilter
          .split('+')
          .map(k => k.trim())
          .filter(k => !!k);

        const matchGlobal = globalKeywords.some(keyword =>
          Object.values(data).some(value =>
            String(value ?? '').toLowerCase().includes(keyword)
          )
        );

        if (!matchGlobal) return false;
      }

      for (const column of Object.keys(columnFilters)) {
        const columnFilter = (columnFilters[column] ?? '').toLowerCase().trim();
        if (!columnFilter) continue;

        const columnKeywords = columnFilter
          .split('+')
          .map(k => k.trim())
          .filter(k => !!k);

        const cellValue = String(data[column] ?? '').toLowerCase();

        const matchColumn = columnKeywords.some(keyword =>
          cellValue.includes(keyword)
        );

        if (!matchColumn) return false;
      }

      return true;
    };

    this.updateDataSourceFilter();
  }

  updateDataSourceFilter(): void {
    const filterObject = {
      global: this.searchText,
      columns: this.columnFilters ?? {},
    };
    this.dataSource.filter = JSON.stringify(filterObject);
  }

  setFilters(): void {
    this.config.userFilters.filters = JSON.stringify({
      global: this.searchText,
      columns: this.columnFilters,
    });
  }

  getMaskedValue(value: string | null): string {
    return value ? '•'.repeat(value.length) : '';
  }

  togglePassword(key: string): void {
    this.isPasswordVisible[key] = !this.isPasswordVisible[key];
  }

  toggleGroup(groupName: string) {
    this.expandedGroups[groupName] = !this.expandedGroups[groupName];
  }

  getGroupIndex(groupName: string): number {
    if (!this.config.expandableGroups || groupName === '_ungrouped') {
      return 0;
    }

    const index = this.availableGroups.indexOf(groupName);
    return index !== -1 ? index + 1 : 0;
  }


  getSelectedRow(element: any): boolean {
    if (!this.selectedRow || !element) {
      return false;
    }
    const key = this.config.rowKey || 'id';
    const id = element[key];
    const selectedId = this.selectedRow[key];
    if (id != undefined && selectedId != undefined) {
      return String(id) === String(selectedId);
    }
    return element === this.selectedRow;
  }

  manageSelectedRow(item: any) {
    this.selectedRow = item;
  }
}
