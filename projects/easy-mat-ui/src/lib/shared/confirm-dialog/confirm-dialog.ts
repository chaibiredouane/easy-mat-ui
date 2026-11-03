import {ChangeDetectionStrategy, Component, inject, Injector} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {ToolbarTranslations} from '../../model/toolbar-config.model';

export interface ConfirmDeleteData {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  icon?: string;
}

@Component({
  selector: 'lib-confirm-dialog',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDeleteData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<ConfirmDialogComponent, boolean>>(MatDialogRef);

  constructor() {
    this.dialogRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close(false));
  }

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}

export function confirmDelete(injector: Injector, translations: ToolbarTranslations): Observable<boolean> {
  return confirmAction(injector, {
    title: translations.deleteConfirmTitle,
    message: translations.deleteConfirmMessage,
    confirm: translations.deleteBtn,
    cancel: translations.cancelBtn
  });
}

export function confirmAction(injector: Injector, data: ConfirmDeleteData): Observable<boolean> {
  return injector
    .get(MatDialog)
    .open<ConfirmDialogComponent, ConfirmDeleteData, boolean>(ConfirmDialogComponent, {
      data,
      width: '400px',
      maxWidth: '92vw',
      autoFocus: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'easy-confirm-panel'
    })
    .afterClosed()
    .pipe(map(result => result === true));
}
