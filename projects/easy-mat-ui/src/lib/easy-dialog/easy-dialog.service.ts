import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EasyDialogComponent} from './easy-dialog.component';
import {
  EASY_DIALOG_DEFAULT_MAX_WIDTH,
  EASY_DIALOG_DEFAULT_WIDTH,
  EasyDialogInit,
  EasyDialogResult,
  EasyDialogSize
} from '../model/easy-dialog-config.model';
import {CRUD, InputType} from '../utils/enums';

const SIZE_WIDTHS: Record<EasyDialogSize, string> = {
  sm: '640px',
  md: '1000px',
  lg: '1200px',
  xl: '1400px'
};

function startsWithDropdown(config: EasyDialogInit<any>): boolean {
  const [first] = [...(config.fields ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return first?.inputType === InputType.Dropdown;
}

@Injectable({providedIn: 'root'})
export class EasyDialogService {
  private readonly dialog = inject(MatDialog);

  open<T = Record<string, any>>(
    config: EasyDialogInit<T>,
    options: MatDialogConfig = {}
  ): MatDialogRef<EasyDialogComponent, EasyDialogResult<T>> {
    const sizeWidth = config.size ? SIZE_WIDTHS[config.size] : undefined;
    const panelClass = ['easy-dialog-panel', ...[options.panelClass ?? []].flat()];

    return this.dialog.open<EasyDialogComponent, EasyDialogInit<T>, EasyDialogResult<T>>(EasyDialogComponent, {
      width: config.width ?? sizeWidth ?? EASY_DIALOG_DEFAULT_WIDTH,
      maxWidth: config.maxWidth ?? EASY_DIALOG_DEFAULT_MAX_WIDTH,
      height: config.height,
      maxHeight: '80vh',
      autoFocus: config.action === CRUD.READ || startsWithDropdown(config) ? 'dialog' : 'first-tabbable',
      hasBackdrop: true,
      ...options,
      panelClass,
      data: config
    });
  }
}
