import {CRUD} from '../utils/enums';
import {EasyDialogInit, EasyDialogResult} from './easy-dialog-config.model';

export type EasyTableDialogMode = 'request' | 'open';

export interface EasyTableDialogRequest<T = any> {
  action: CRUD;
  data: T;
}

export interface EasyTableDialogResult<T = any> {
  request: EasyTableDialogRequest<T>;
  result: EasyDialogResult<T>;
}

export interface EasyTableDialogConfig {
  add?: boolean;
  edit?: boolean;
  view?: boolean;
  mode?: EasyTableDialogMode;
  form?: EasyDialogInit<any> | ((request: EasyTableDialogRequest) => EasyDialogInit<any>);
}

const DIALOG_KEYS: Partial<Record<CRUD, 'add' | 'edit' | 'view'>> = {
  [CRUD.CREATE]: 'add',
  [CRUD.UPDATE]: 'edit',
  [CRUD.READ]: 'view'
};

export function resolveDialogRequest<T = any>(
  dialog: EasyTableDialogConfig | undefined,
  action: CRUD,
  data: T
): EasyTableDialogRequest<T> | null {
  const key = DIALOG_KEYS[action];
  return key && dialog?.[key] ? {action, data} : null;
}
