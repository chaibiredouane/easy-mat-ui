import {DestroyRef, Injector} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CRUD} from '../../utils/enums';
import {EasyDialogService} from '../../easy-dialog/easy-dialog.service';
import {
  EasyTableDialogConfig,
  EasyTableDialogRequest,
  EasyTableDialogResult,
  resolveDialogRequest
} from '../../model/easy-table-dialog.model';

export interface TableDialogTrigger {
  config: EasyTableDialogConfig | undefined;
  action: CRUD;
  data: object;
  injector: Injector;
  destroyRef: DestroyRef;
  onRequest: (request: EasyTableDialogRequest) => void;
  onResult: (event: EasyTableDialogResult) => void;
}

export function triggerTableDialog(trigger: TableDialogTrigger): boolean {
  const request = resolveDialogRequest(trigger.config, trigger.action, trigger.data);
  if (!request) {
    return false;
  }

  if (shouldOpenDialog(trigger.config)) {
    openDialog(trigger, request);
  } else {
    trigger.onRequest(request);
  }
  return true;
}

function shouldOpenDialog(config: EasyTableDialogConfig | undefined): boolean {
  if (config?.mode !== 'open') {
    return false;
  }
  if (!config.form) {
    console.warn('[easy-mat-ui] dialog.mode is "open" but dialog.form is missing: emitting a dialog request instead.');
    return false;
  }
  return true;
}

function openDialog(trigger: TableDialogTrigger, request: EasyTableDialogRequest): void {
  const {form} = trigger.config!;
  const dialogConfig = typeof form === 'function' ? form(request) : form;

  trigger.injector
    .get(EasyDialogService)
    .open({data: request.data, ...dialogConfig, action: request.action})
    .afterClosed()
    .pipe(takeUntilDestroyed(trigger.destroyRef))
    .subscribe(result => {
      if (result) {
        trigger.onResult({request, result});
      }
    });
}
