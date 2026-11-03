import {MatFormFieldAppearance} from '@angular/material/form-field';
import {ColumnSize, CRUD, InputType} from '../utils/enums';

export const EASY_DIALOG_DEFAULT_WIDTH = '87%';
export const EASY_DIALOG_DEFAULT_MAX_WIDTH = '90vw';

export type EasyDialogSize = 'sm' | 'md' | 'lg' | 'xl';

export type EasyDialogButtonColor = 'green' | 'red' | 'blue' | 'yellow' | 'taupe' | 'info';

export interface EasyDialogField {
  name: string;
  inputType?: InputType | string;
  gridSize?: number;
  order?: number;
  readonly?: boolean;
  size?: ColumnSize | string;
  filterList?: any[];
  displayColumn?: string | null;
  filterValue?: string | null;
  isRequired?: boolean;
}

export interface EasyDialogAction {
  id: string;
  icon: string;
  title?: string;
  color?: EasyDialogButtonColor;
  disabled?: (data: any) => boolean;
  hidden?: boolean;
}

export interface EasyDialogTranslations {
  actions: Partial<Record<CRUD, string>>;
  clear: string;
  unsavedTitle: string;
  unsavedMessage: string;
  confirmSave: string;
  discard: string;
  incompleteTitle: string;
  incompleteMessage: string;
  auditCreatedBy: string;
  auditUpdatedBy: string;
  auditOn: string;
  auditInactiveSince: string;
}

export const DEFAULT_EASY_DIALOG_TRANSLATIONS: EasyDialogTranslations = {
  actions: {},
  clear: 'clear',
  unsavedTitle: 'DETECT_CHANGES',
  unsavedMessage: 'ASK_SAVE_CHANGES',
  confirmSave: 'CONFIRMATION_SAVE',
  discard: 'CONFIRMATION_SAVE_CANCEL',
  incompleteTitle: 'UNCOMPLETED_FORM',
  incompleteMessage: 'FILL_MISSING_FIELDS',
  auditCreatedBy: 'CREATED_BY',
  auditUpdatedBy: 'UPDATED_BY',
  auditOn: 'ON',
  auditInactiveSince: 'INACTIVE_SINCE'
};

export interface EasyDialogResult<T = Record<string, any>> {
  event: CRUD | 'Cancel' | string;
  data?: T;
}

export class EasyDialogConfig<T = Record<string, any>> {
  title = '';
  titleField?: string;
  showActionLabel = true;
  icon?: string;
  action = CRUD.UPDATE;
  data = {} as T;
  fields: EasyDialogField[] = [];
  prefix = '';
  pk = '';
  validate?: (data: T) => boolean;
  validationMessage?: (data: T) => string | null;

  appearance: MatFormFieldAppearance = 'outline';
  compact = false;
  size?: EasyDialogSize;
  width = EASY_DIALOG_DEFAULT_WIDTH;
  maxWidth = EASY_DIALOG_DEFAULT_MAX_WIDTH;
  height?: string;

  saveIcon = 'check';
  saveTitle = 'SAVE';
  closeIcon = 'logout';
  closeTitle = 'CLOSE';
  extraActions: EasyDialogAction[] = [];
  translations: EasyDialogTranslations = {...DEFAULT_EASY_DIALOG_TRANSLATIONS};
  modal = true;
  confirmOnClose = true;

  withAuditFields = true;

  constructor(init?: EasyDialogInit<T>) {
    Object.assign(this, init);
    this.translations = {...DEFAULT_EASY_DIALOG_TRANSLATIONS, ...init?.translations};
  }
}

export type EasyDialogInit<T = Record<string, any>> =
  Partial<Omit<EasyDialogConfig<T>, 'translations'>> & { translations?: Partial<EasyDialogTranslations> };
