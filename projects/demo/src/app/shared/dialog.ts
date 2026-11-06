import { CRUD, EasyDialogResult } from 'easy-mat-ui';

/** True when a dialog result must be persisted (created or updated). */
export function isSave(result: EasyDialogResult | undefined): boolean {
  return result?.event === CRUD.CREATE || result?.event === CRUD.UPDATE;
}
