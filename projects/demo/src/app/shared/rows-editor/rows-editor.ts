import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface RowColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'color';
  /** For `select`: the choices. */
  options?: { value: string; label: string }[];
}

export type Row = Record<string, string | number | boolean | undefined>;

/**
 * A small editor for a list of rows (the items of a menu, the fields of a model...). Each row is a group of labelled
 * inputs that wraps on a narrow screen. It never changes its input: it emits a new list.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-rows-editor',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <div class="rows">
      @for (row of rows(); track $index; let i = $index) {
        <div class="row" role="group" [attr.aria-label]="(i + 1).toString()">
          @for (column of columns(); track column.key) {
            <label class="cell" [class.check]="column.type === 'checkbox'">
              <span class="label">{{ column.label }}</span>
              @switch (column.type) {
                @case ('select') {
                  <select [value]="row[column.key] ?? ''" (change)="set(i, column.key, $any($event.target).value)">
                    @for (option of column.options; track option.value) {
                      <option [value]="option.value" [selected]="option.value === row[column.key]">{{ option.label }}</option>
                    }
                  </select>
                }
                @case ('checkbox') {
                  <input type="checkbox" [checked]="!!row[column.key]" (change)="set(i, column.key, $any($event.target).checked)" />
                }
                @case ('number') {
                  <input type="number" [value]="row[column.key] ?? ''" (input)="set(i, column.key, number($any($event.target).value))" />
                }
                @case ('color') {
                  <input type="color" [value]="row[column.key] || '#1f6f8b'" (input)="set(i, column.key, $any($event.target).value)" />
                }
                @default {
                  <input type="text" [value]="row[column.key] ?? ''" (input)="set(i, column.key, $any($event.target).value)" />
                }
              }
            </label>
          }
          <button type="button" class="remove" [disabled]="rows().length <= min()" [title]="'builder.REMOVE_ROW' | translate" [attr.aria-label]="'builder.REMOVE_ROW' | translate" (click)="remove(i)">
            <mat-icon aria-hidden="true">close</mat-icon>
          </button>
        </div>
      }
    </div>
    <button type="button" class="add" (click)="add()"><mat-icon aria-hidden="true">add</mat-icon>{{ 'builder.ADD_ROW' | translate }}</button>
  `,
  styles: `
    :host { display: block; }
    .rows { display: grid; gap: 8px; }
    .row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--card-bg); }
    .cell { display: flex; flex: 1 1 110px; flex-direction: column; gap: 4px; min-width: 0; }
    .cell.check { flex: 0 0 auto; align-items: center; }
    .label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); }
    input[type='text'], input[type='number'], select { min-height: 36px; width: 100%; padding: 0 8px; border: 1px solid var(--input-border); border-radius: var(--radius-sm); background: var(--input-bg); color: var(--input-text); font: inherit; font-size: 0.85rem; }
    input[type='color'] { width: 44px; height: 36px; padding: 2px; border: 1px solid var(--input-border); border-radius: var(--radius-sm); background: var(--input-bg); cursor: pointer; }
    input[type='checkbox'] { width: 20px; height: 36px; accent-color: var(--demo-accent); cursor: pointer; }
    input:focus-visible, select:focus-visible, button:focus-visible { outline: 2px solid var(--demo-accent); outline-offset: 1px; }
    /* No padding and a icon that does not shrink: with the default padding of a button, a 36px button left less than 24px to the icon, which was cut in half. */
    .remove { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--text-muted); cursor: pointer; }
    .remove mat-icon { flex: none; }
    .remove:hover:not(:disabled) { background: var(--hover-color); color: var(--card-text); }
    .remove:disabled { opacity: 0.35; cursor: not-allowed; }
    .add { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; min-height: 36px; padding: 0 14px; border: 1px dashed var(--border-color); border-radius: 999px; background: transparent; color: var(--card-text); font: inherit; font-size: 0.82rem; cursor: pointer; }
    .add:hover { background: var(--hover-color); }
    .add mat-icon { width: 18px; height: 18px; font-size: 18px; }
  `
})
export class RowsEditor {
  columns = input.required<RowColumn[]>();
  rows = input.required<Row[]>();
  /** Rows that cannot be removed: the list keeps at least this many. */
  min = input(1);
  /** The row added by the "Add" button. */
  template = input<Row>({});

  rowsChange = output<Row[]>();

  number(value: string): number | undefined {
    return value === '' ? undefined : Number(value);
  }

  set(index: number, key: string, value: string | number | boolean | undefined): void {
    this.rowsChange.emit(this.rows().map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  add(): void {
    this.rowsChange.emit([...this.rows(), { ...this.template() }]);
  }

  remove(index: number): void {
    if (this.rows().length > this.min()) this.rowsChange.emit(this.rows().filter((_, i) => i !== index));
  }
}
