import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DateAdapter, NativeDateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {EMPTY, filter, map, merge, Observable, startWith} from 'rxjs';
import {ColumnSize, CRUD, InputType, ScreenSize} from '../utils/enums';
import {EasyMultiSelect} from '../easy-multi-select/easy-multi-select';
import {Utils} from '../utils/utils';
import {
  EasyDialogAction,
  EasyDialogConfig,
  EasyDialogField,
  EasyDialogInit,
  EasyDialogResult
} from '../model/easy-dialog-config.model';

interface DropdownState {
  control: FormControl<any>;
  options$: Observable<any[]>;
  displayFn: (item: any) => string;
}

// Calendar locale per app language ('lu' is Luxembourgish, ISO code 'lb').
const CALENDAR_LOCALES: Record<string, string> = {en: 'en-GB', fr: 'fr-FR', de: 'de-DE', lu: 'lb-LU'};

class MondayDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

const GRID_COLUMNS = 12;
const DEFAULT_GRID_SIZE = 6;
const DEFAULT_TEXTAREA_ROWS = 3;
const AUDIT_DISPLAY_FORMAT = 'yyyy-MM-dd HH:mm';

const ACTION_ICONS: Record<string, string> = {
  [CRUD.CREATE]: 'add',
  [CRUD.READ]: 'visibility',
  [CRUD.UPDATE]: 'edit',
  [CRUD.DELETE]: 'delete',
  [CRUD.LINK]: 'link',
  [CRUD.DUPLICATE]: 'content_copy'
};

const ACTION_LABELS: Record<string, string> = {
  [CRUD.CREATE]: 'Create',
  [CRUD.READ]: 'View',
  [CRUD.UPDATE]: 'Edit',
  [CRUD.DELETE]: 'Delete',
  [CRUD.LINK]: 'Link',
  [CRUD.DUPLICATE]: 'Duplicate'
};

const TEXTAREA_ROWS: Record<string, number> = {
  [ColumnSize.XSmall]: 1,
  [ColumnSize.Small]: 2,
  [ColumnSize.Medium]: 3,
  [ColumnSize.Large]: 4,
  [ColumnSize.XLarge]: 5
};

function toLabelPrefix(prefix: string): string {
  const trimmed = prefix?.trim() ?? '';
  return trimmed && !trimmed.endsWith('.') ? `${trimmed}.` : trimmed;
}

function requireSelection(control: AbstractControl): ValidationErrors | null {
  return control.value && typeof control.value === 'object' ? null : {required: true};
}

function isEmpty(value: unknown): boolean {
  return value == null || String(value).trim() === '';
}

function filterOptions(options: any[], search: unknown, displayKey: string): any[] {
  const term = typeof search === 'string' ? search.trim().toLowerCase() : '';
  if (!term) {
    return options;
  }
  return options.filter(option => String(option?.[displayKey] ?? '').toLowerCase().includes(term));
}

@Component({
  selector: 'lib-easy-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    TranslateModule,
    EasyMultiSelect
  ],
  providers: [provideNativeDateAdapter(), {provide: DateAdapter, useClass: MondayDateAdapter}],
  templateUrl: './easy-dialog.component.html',
  styleUrls: ['./easy-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EasyDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<EasyDialogComponent, EasyDialogResult>>(MatDialogRef);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = new EasyDialogConfig(inject<EasyDialogInit | null>(MAT_DIALOG_DATA, {optional: true}) ?? {});
  readonly isReadOnly = this.config.action === CRUD.READ;
  readonly data: Record<string, any> = {...this.config.data};
  readonly groupedFields = this.groupFieldsByRow(this.config.fields);
  readonly dropdowns = this.createDropdowns(this.config.fields);
  readonly dateControls = this.createDateControls(this.config.fields);
  readonly confirmingClose = signal(false);
  readonly formError = signal(false);

  protected readonly InputType = InputType;

  private readonly labelPrefix = toLabelPrefix(this.config.prefix);

  constructor() {
    this.routeCloseThroughConfirmation();
    this.syncCalendarLocale();
  }

  get actionLabel(): string {
    const {action, translations} = this.config;
    const key = translations.actions[action];
    return key ? this.translate.instant(key) : ACTION_LABELS[action];
  }

  get subject(): string {
    const {title, titleField} = this.config;
    const subject = title ? this.translate.instant(title) : '';
    const dynamicPart = titleField ? this.data[titleField] : null;
    return isEmpty(dynamicPart) ? subject : [subject, dynamicPart].filter(Boolean).join(' — ');
  }

  get icon(): string {
    return this.config.icon ?? ACTION_ICONS[this.config.action] ?? 'edit';
  }

  get buttonSize(): string {
    return this.config.compact ? 'btn-small' : 'btn-medium';
  }

  get visibleActions(): EasyDialogAction[] {
    return this.config.extraActions.filter(action => !action.hidden);
  }

  get auditCreated(): string | null {
    const {config, data} = this;
    return config.withAuditFields ? this.auditLine(config.translations.auditCreatedBy, data['createdBy'], data['startDate']) : null;
  }

  get auditUpdated(): string | null {
    const {config, data} = this;
    return config.withAuditFields ? this.auditLine(config.translations.auditUpdatedBy, data['updatedBy'], data['lastUpdatedDate']) : null;
  }

  get auditInactive(): string | null {
    return this.config.withAuditFields ? this.inactiveLine() : null;
  }

  get validationError(): string | null {
    return this.isReadOnly ? null : this.config.validationMessage?.(this.data) ?? null;
  }

  doAction(): void {
    this.dialogRef.close({event: this.config.action, data: this.data});
  }

  onExtraAction(action: EasyDialogAction): void {
    this.dialogRef.close({event: action.id, data: this.data});
  }

  closeDialog(): void {
    if (this.confirmingClose()) {
      return;
    }
    if (this.config.confirmOnClose && !this.isReadOnly && this.hasChanged()) {
      this.formError.set(false);
      this.confirmingClose.set(true);
      return;
    }
    this.discardChanges();
  }

  confirmSave(): void {
    this.confirmingClose.set(false);
    if (this.isInvalidForm()) {
      this.formError.set(true);
      return;
    }
    this.doAction();
  }

  discardChanges(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  isRequired(field: EasyDialogField): boolean {
    return !!field.isRequired && !this.isReadOnly && !field.readonly;
  }

  isInvalidForm(): boolean {
    return this.hasMissingRequiredFields() || this.failsCustomValidation();
  }

  getHeaderName(columnName: string): string {
    const fullKey = this.labelPrefix + columnName;
    const shortKey = `${this.labelPrefix}short_${columnName}`;
    const isSmallScreen = (Utils.screen_size ?? window.innerWidth) < ScreenSize.lg;
    const keys = isSmallScreen ? [shortKey, fullKey] : [fullKey];

    return keys.map(key => this.translateOrNull(key)).find(Boolean) ?? columnName;
  }

  getMultiSelectValue(field: EasyDialogField): string {
    return field.filterValue ?? 'id';
  }

  getMultiSelectDisplay(field: EasyDialogField): string {
    return field.displayColumn ?? 'name';
  }

  getMultiSelectSelection(field: EasyDialogField): any[] {
    const selectedValues: unknown[] = this.data[field.name] ?? [];
    const valueKey = this.getMultiSelectValue(field);
    return (field.filterList ?? []).filter(option => selectedValues.includes(option[valueKey]));
  }

  onMultiSelectChange(field: EasyDialogField, values: unknown[]): void {
    this.data[field.name] = [...values];
  }

  getRowsFromSize(size: ColumnSize | string | undefined): number {
    return TEXTAREA_ROWS[size ?? ''] ?? DEFAULT_TEXTAREA_ROWS;
  }

  getDateValue(field: EasyDialogField): string {
    const value = this.data[field.name];
    if (!value) {
      return '';
    }
    const isoDate = value instanceof Date ? value.toISOString() : String(value);
    return isoDate.slice(0, 10);
  }

  onDateChange(date: string, field: EasyDialogField): void {
    this.data[field.name] = date ? `${date}T${this.currentTime()}` : null;
  }

  private routeCloseThroughConfirmation(): void {
    this.dialogRef.disableClose = true;
    const backdropClicks = this.config.modal ? EMPTY : this.dialogRef.backdropClick();
    const escapeKeys = this.dialogRef.keydownEvents().pipe(filter(event => event.key === 'Escape' && !event.defaultPrevented));

    merge(backdropClicks, escapeKeys)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  private hasChanged(): boolean {
    const original: Record<string, any> = this.config.data;
    const keys = new Set([...Object.keys(original), ...Object.keys(this.data)]);
    return [...keys].some(key => !Utils.areValuesEqual(original[key], this.data[key]));
  }

  private hasMissingRequiredFields(): boolean {
    return this.config.fields.some(field => this.isRequired(field) && isEmpty(this.data[field.name]));
  }

  private failsCustomValidation(): boolean {
    const {validate, pk} = this.config;
    if (validate) {
      return !validate(this.data);
    }
    return !!pk && isEmpty(this.data[pk]);
  }

  private auditLine(labelKey: string, user: unknown, date: unknown): string | null {
    if (isEmpty(user) && isEmpty(date)) {
      return null;
    }
    const {translations} = this.config;
    const when = isEmpty(date) ? '' : `${this.translate.instant(translations.auditOn)} ${formatDate(date as string, AUDIT_DISPLAY_FORMAT, 'en-US')}`;
    return [this.translate.instant(labelKey), user, when].filter(part => !isEmpty(part)).join(' ');
  }

  private inactiveLine(): string | null {
    const endDate = this.data['endDate'];
    if (this.data['isActive'] !== false || isEmpty(endDate)) {
      return null;
    }
    const label = this.translate.instant(this.config.translations.auditInactiveSince);
    return `${label} ${formatDate(endDate, AUDIT_DISPLAY_FORMAT, 'en-US')}`;
  }

  private translateOrNull(key: string): string | null {
    const text = this.translate.instant(key);
    return text && text !== key ? text : null;
  }

  private currentTime(): string {
    const now = new Date();
    return [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(part => part.toString().padStart(2, '0'))
      .join(':');
  }

  private groupFieldsByRow(fields: EasyDialogField[]): EasyDialogField[][] {
    const rows: EasyDialogField[][] = [];
    let usedColumns = GRID_COLUMNS;

    [...fields]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach(field => {
        const size = field.gridSize || DEFAULT_GRID_SIZE;
        if (usedColumns + size > GRID_COLUMNS) {
          rows.push([]);
          usedColumns = 0;
        }
        rows[rows.length - 1].push(field);
        usedColumns += size;
      });

    return rows;
  }

  private syncCalendarLocale(): void {
    const adapter = inject<DateAdapter<Date>>(DateAdapter);
    const apply = (lang?: string) => adapter.setLocale(CALENDAR_LOCALES[lang ?? ''] ?? 'en-GB');
    apply(this.translate.currentLang || this.translate.defaultLang);
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({lang}) => apply(lang));
  }

  private createDateControls(fields: EasyDialogField[]): Record<string, FormControl<Date | null>> {
    const dateFields = fields.filter(field => field.inputType === InputType.Date);
    return Object.fromEntries(dateFields.map(field => [field.name, this.createDateControl(field)]));
  }

  private createDateControl(field: EasyDialogField): FormControl<Date | null> {
    const [year, month, day] = this.getDateValue(field).split('-').map(Number);
    const initial = year ? new Date(year, month - 1, day) : null;
    const control = new FormControl<Date | null>({value: initial, disabled: this.isReadOnly || !!field.readonly});

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(date => {
      const day = date
        ? [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part, i) => String(part).padStart(i ? 2 : 4, '0')).join('-')
        : '';
      this.onDateChange(day, field);
    });
    return control;
  }

  private createDropdowns(fields: EasyDialogField[]): Record<string, DropdownState> {
    const dropdownFields = fields.filter(field => field.inputType === InputType.Dropdown);
    return Object.fromEntries(dropdownFields.map(field => [field.name, this.createDropdown(field)]));
  }

  private createDropdown(field: EasyDialogField): DropdownState {
    const options = field.filterList ?? [];
    const valueKey = field.filterValue ?? field.name;
    const displayKey = field.displayColumn ?? field.name;
    const currentValue = this.data[field.name];
    const selected = currentValue == null ? null : options.find(option => option[valueKey] == currentValue) ?? null;

    const validators = this.isRequired(field) ? [requireSelection] : [];
    const control = new FormControl<any>({value: selected, disabled: this.isReadOnly || !!field.readonly}, validators);

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.data[field.name] = typeof value === 'string' ? null : (value?.[valueKey] ?? null);
    });

    return {
      control,
      options$: control.valueChanges.pipe(
        startWith(control.value),
        map(search => filterOptions(options, search, displayKey))
      ),
      displayFn: (item: any) => (item && typeof item === 'object' ? String(item[displayKey] ?? '') : (item ?? ''))
    };
  }
}
