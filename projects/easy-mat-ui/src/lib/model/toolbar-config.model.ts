export class ToolbarTranslations {
  title: string | null = null;
  search = 'SEARCH';
  clear = 'CLEAR';
  addBtn = 'ADD';
  exportBtn = 'DOWNLOAD';
  close = 'CLOSE';
  auditTrailBtn = 'AUDIT_TRAIL';
  linkBtn = 'link';
  editBtn = 'edit';
  deleteBtn = 'Delete';
  cancelBtn = 'Cancel';
  deleteConfirmTitle = 'Delete this item?';
  deleteConfirmMessage = 'This action cannot be undone.';
  customActionTitle = '';

  constructor(data?: Partial<ToolbarTranslations>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ToolbarConfig {
  icon = '';
  iconClass = 'taupe';
  withGlobalFilter = true;
  isAndFilterOperator = true;
  logout = false;
  btnSize = 'btn-small';

  customActionEnable = false;
  customActionIcon?: string;
  customRowActionClass = '';

  translations: ToolbarTranslations = new ToolbarTranslations();

  constructor(
    data?: Partial<Omit<ToolbarConfig, 'translations'>> & {
      translations?: Partial<ToolbarTranslations>;
    },
  ) {
    if (data) {
      const {translations, ...rest} = data;
      Object.assign(this, rest);
      if (translations) {
        this.translations = new ToolbarTranslations(translations);
      }
    }
  }
}
